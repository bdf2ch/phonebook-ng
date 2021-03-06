import {Component, OnInit, ViewChild, AfterContentChecked, ChangeDetectorRef} from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { appConfig } from '../../app.config';
import { PhoneBookService } from './phone-book.service';
import { SessionService } from "../session/session.service";
import { Division } from "../../models/division.model";
import { ContactListComponent } from "../../contacts/contact-list/contact-list.component";
import {Contact} from "../../models/contact.model";
//import { ModalService } from '../utilities/modal/modal.service';
import { ModalsService } from '@bdf2ch/angular-transistor';
import { PhoneBookManagerService } from '../../manager/phone-book-manager.service';
import { DivisionTreeService } from '../divisions/division-tree/division-tree.service';
import { ContactGroup } from '../../models/contact-group.model';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/observable/of';
import { Subject } from "rxjs/Subject";
import { isError } from "../../models/error.model";
import { CookieService } from '../cookies/cookie.services';
import { Phone } from '../../models/phone.model';
import { NgForm } from '@angular/forms';
import {Office} from "../../models/office.model";
import {OfficesService} from "../offices/offices.service";
import {DivisionsService} from "../divisions/divisions.service";
import {OrganizationsService} from "../organizations/organizations.service";
import {ContactsService} from "../../contacts/contacts.service";

@Component({
    templateUrl: './phone-book.component.html',
    styleUrls: ['./phone-book.component.css']
})
export class PhoneBookComponent implements  OnInit, AfterContentChecked {
    private inAuthMode: boolean = false;
    private inUserMenuMode: boolean = false;
    private inEditContactMode: boolean = true;
    private isAtsPanelOpened: boolean = false;
    private sourceAtsId: number;
    //@ViewChild(ContactListComponent) list: ContactListComponent;
    //private newDivision: Division;
    private newContact: Contact;
    private newContactPhone: Phone;
    //private newOffice: Office;
    private users: User[] = [];
    private usersStream: Observable<User[]>;
    private searchTerms: Subject<string>;
    private usersSearchQuery: string = '';
    private selectedContactUserBackup: User | null = null;
    private authorization = {
        login: '',
        password: '',
        userNotFound: false
    };


    constructor(private detector: ChangeDetectorRef,
                private phoneBook: PhoneBookService,
                private manager: PhoneBookManagerService,
                private trees: DivisionTreeService,
                private session: SessionService,
                private cookies: CookieService,
                private modals: ModalsService,
                private router: Router,
                private route: ActivatedRoute,
                private offices: OfficesService,
                private divisions: DivisionsService,
                private organizations: OrganizationsService,
                private contacts: ContactsService) {
        //this.newDivision = new Division();
        //this.newDivision.setupBackup(['parentId', 'title']);
        this.newContact = new Contact();
        this.newContact.setupBackup(['userId', 'surname', 'name', 'fname', 'position', 'email', 'mobile']);
        this.newContactPhone = new Phone();
        this.newContactPhone.setupBackup(['atsId', 'number']);
        this.searchTerms = new Subject<string>();

        this.searchTerms
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap((term) => {
                console.log('search term', term);
                this.divisions.selected(null);
                this.phoneBook.allowToAddContacts = false;
                this.trees.getById('phone-book-divisions').deselect();
                return term ? this.contacts.search(term, this.phoneBook.selectedAts.id, this.session.user ? this.session.user.id : 0) : Observable.of<ContactGroup[]>([])
            })
            .subscribe((res: any) => {
                console.log('res', res);
                this.router.navigate(['/']);
            });
        //this.newOffice = new Office();
        //this.newOffice.organizationId = appConfig.defaultOrganizationId;
        //this.newOffice.setupBackup(['organizationId', 'address']);
        //this.offices.new.organizationId = appConfig.defaultOrganizationId;
        //this.divisions.new.parentId = appConfig.defaultOrganizationId;



        this.route.queryParams.subscribe((params: ParamMap) => {
            if (params['search']) {
                this.phoneBook.searchQuery = this.phoneBook.convertLatinToCyrillic(params['search']);
                this.phoneBook.searchContacts(this.session.user ? this.session.user.id : null).subscribe();
            }
        });
    };


    search(term: string): void {
        this.contacts.searchQuery = this.phoneBook.convertLatinToCyrillic(term);
        if (term.length > 2) {
            console.log('term', term);
            this.searchTerms.next(this.contacts.searchQuery);
            //this.router.navigate(['/']);
        }
    };


    /**
     * Инициализация компонента.
     * При наличии избранных контактов у текущего пользователя - показываем избранные контакты
     */
    ngOnInit(): void {
        /*
        if (this.phoneBook.favorites.contacts.length > 0) {
            this.phoneBook.isInFavoritesMode = true;
            this.router.navigate(['favorites']);
        }
        */



        if (appConfig.isInTestMode) {
            let i = 0;
            setInterval(() => {
                this.phoneBook.fetchContactsByDivisionIdRecursive(this.phoneBook.ids[i], appConfig.defaultSourceAtsId, this.session.session ? this.session.session.token : '').subscribe(() => {
                    i = (i + 1) < this.phoneBook.ids.length - 1 ? i + 1 : 0;
                });
            }, 10000)
        }
    };


    ngAfterContentChecked(): void {
        //this.modals.open('new-contact-modal');
    };


    /**
     * Открывает модальное окно авторизации пользователя
     */
    openAuthModal(): void {
        //this.inAuthMode = true;
        this.modals.get('authorization-modal').open();
    };


    /**
     * Авторизация пользователя
     */
    login(): void {
        this.session.logIn(this.authorization.login, this.authorization.password).subscribe((result: any) => {
            if (result !== null) {
                console.log('result', result);
                this.authorization.userNotFound = false;
                this.cookies.set({
                    name: 'kolenergo',
                    value: result.session.token
                });
                this.modals.get('authorization-modal').close();
            } else {
                this.authorization.userNotFound = true;
                console.log('USER NOT FOUND');
            }
        });
    };


    /**
     * Закрывает модальное окно авторизации пользователя
     */
    closeAuthModal(form: NgForm): void {
        //this.authorization.login = '';
        //this.authorization.password = '';
        this.authorization.userNotFound = false;
        form.form.reset({
            account: '',
            password: ''
        });
        this.detector.detectChanges();
        this.modals.get('authorization-modal');
        //this.inAuthMode = false;
    };


    /**
     * Открывает модальное окно с меню текущего пользователя
     */
    openUserMenuModal(): void {
        this.inUserMenuMode = true;
    };


    /**
     * Закрывает модальное окно с меню текущего пользователя
     */
    closeUserMenuModal(): void {
        this.inUserMenuMode = false;
    };


    /**
     * Открывает модальное окно редактированяи данных выбранного контакта
     */
    //openEditContactModal(): void {
    //    this.inEditContactMode = true;
    //};


    /**
     * Закрывает модальное окно редактирования данных выбранного пользователя
     */
    //closeEditContactModal(): void {
    //    this.phoneBook.selectedContact = null;
    //    this.inEditContactMode = false;
    //};


    /**
     * Открывает панель выбора АТС
     */
    openAtsPanel(): void {
        this.isAtsPanelOpened = true;
    };


    /**
     * Закрывает панель выбора АТС
     */
    closeAtsPanel(): void {
        this.isAtsPanelOpened = false;
    };


    /*
    selectOrganization(division: Division): void {
        console.log('selected organization', division);
        //this.newOffice.organizationId = division.id;
        this.organizations.selected = division;
        this.offices.new.organizationId = division.id;
        this.divisions.new.parentId = division.id;
    };
    */


    selectDivision(division: Division | null): void {

        //this.phoneBook.isInFavoritesMode = false;
        //this.phoneBook.selectedDivision = division;
        if (division) {
            this.divisions.selected(division);
            this.router.navigate(['/division', division.id]);
            console.log('selected division id = ', division.id);
            this.contacts.searchQuery = '';
            //this.newDivision.parentId = division.id;
            this.divisions.new().parentId = division.id;
            this.phoneBook.isInFavoritesMode = false;
            this.phoneBook.allowToAddContacts = this.session.user && this.session.user.isAdministrator ? true : false;

            /*
            this.phoneBook.fetchContactsByDivisionIdRecursive(division.id, this.phoneBook.selectedAts.id, this.session.session ? this.session.session.token : '').subscribe(() => {
                document.getElementById('app-content').scrollTop = 0;
                this.phoneBook.searchQuery = '';
                if (this.isAtsPanelOpened) {
                    this.isAtsPanelOpened = false;
                }
            });
            */


            /*
            this.contacts.getByDivisionIdRecursive(division.id, this.phoneBook.selectedAts.id, this.session.session ? this.session.session.token : '')
                .subscribe(() => {
                    document.getElementById('app-content').scrollTop = 0;
                    //this.phoneBook.searchQuery = '';
                    if (this.isAtsPanelOpened) {
                        this.isAtsPanelOpened = false;
                    }
                });
                */
        } else {
            this.divisions.selected(null);
            //this.phoneBook.clearContactGroups();
            //this.newDivision.parentId = 0;
            this.divisions.new().parentId = this.organizations.selected() ? this.organizations.selected().id : 0;
            //this.phoneBook.contacts = [];
            this.contacts.contacts = Observable.of<ContactGroup[]>([]);
        };
    };


    searchContacts(value: string): void {
        this.phoneBook.searchQuery = this.phoneBook.convertLatinToCyrillic(value);
        if (value.length >= 3) {
            this.phoneBook.searchContacts(this.session.user ? this.session.user.id : 0).subscribe(() => {
                this.router.navigate(['/']);
            });
        }
    };



    clearSearch(): void {
        this.contacts.clearSearch();
        this.phoneBook.allowToAddContacts = this.session.user && this.session.user.isAdministrator ? true : false;
    };



    selectAts(): void {
        console.log('ats changed');
        if (this.phoneBook.searchQuery.length > 3) {
            this.phoneBook.searchContacts().subscribe();
        } else {
            //console.log(this.route);

            if (this.phoneBook.isInFavoritesMode) {
                this.phoneBook.fetchFavoriteContacts(
                    this.session.user !== null ? this.session.user.id : 0,
                    this.phoneBook.selectedAts.id
                ).subscribe(() => {

                    });
            } else {
                this.phoneBook.fetchContactsByDivisionIdRecursive(this.phoneBook.selectedDivision.id, this.phoneBook.selectedAts.id, this.session.session ? this.session.session.token : '')
                    .subscribe();
            }

        }
    };


    switchToFavorites(): void {
        this.phoneBook.isInFavoritesMode = true;
        const container = document.getElementById('app-content');
        if (container) {
            container.scrollTop = 0;
        }
    };


    onChangeContactPhotoPosition(position: any): void {
        console.log(position);
        //this.phoneBook.setContactPhotoPosition(this.phoneBook.selectedContact.id, position.photo_top, position.photo_left, position.photo_zoom)
        //    .subscribe((pos: IContactPhotoPosition) => {
                //this.phoneBook.selectedContact.setPhotoPosition(position);
        //    });
    };



    onCancelContactPosition(position: any): void {
        //this.phoneBook.selectedContact.setPhotoPosition(position);
    };




    openNewDivisionModal(): void {
        //this.newDivision.parentId = this.phoneBook.selectedDivision ? this.phoneBook.selectedDivision.id : this.phoneBook.selectedOrganization.id;
        //this.divisions.new.parentId = this.phoneBook.selectedDivision ? this.phoneBook.selectedDivision.id : this.phoneBook.selectedOrganization.id;
        //this.divisions.new.parentId = this.divisions.selected ? this.divisions.selected.id : this.organizations.selected.id;
        console.log('parentId', this.divisions.new().parentId);

        this.modals.get('new-division-modal').open();
    };


    closeNewDivisionModal(form: any): void {
        //this.newDivision.restoreBackup();
        //this.divisions.new.restoreBackup();
        form.reset({
            parent: this.divisions.selected() ? this.divisions.selected().id : this.organizations.selected().id,
            title: ''
        });
        this.detector.detectChanges();
    };




    addDivision(): void {
        this.divisions.add(this.divisions.new(), this.session.session ? this.session.session.token : '')
            .subscribe((result: Division) => {
                if (result) {
                    const tree = this.trees.getById('phone-book-divisions');
                    if (tree) {
                        tree.addDivision(result);
                    }
                    this.detector.detectChanges();
                    this.modals.get('new-division-modal').close();
                }
            });
    };



    openEditDivisionModal(): void {
        this.modals.get('edit-division-modal').open();
    };


    closeEditDivisionModal(form: NgForm): void {
        this.divisions.selected().restoreBackup();
        form.reset({
            title: this.divisions.selected().title
        });
        this.detector.detectChanges();

    };


    editDivision(form: NgForm): void {
        /*
        this.manager.editDivision(this.phoneBook.selectedDivision).subscribe((result: boolean) => {
            if (result) {
                this.phoneBook.contacts.forEach((group: ContactGroup) => {
                    //console.log('officeID', this.phoneBook.selectedDivision.officeId);
                    //const office = this.phoneBook.getOfficeById(this.phoneBook.selectedDivision.officeId);
                    //console.log('office', office);
                    //if (office) {
                    //    group.contacts.forEach((contact: Contact) => {
                    //        contact.officeId = this.phoneBook.selectedDivision.officeId;
                            //contact.office = office;
                    //    });
                    //}
                });
                this.modals.get('edit-division-modal').close();
            }
        });
        */


        this.divisions.edit(this.divisions.selected(), this.session.session ? this.session.session.token : '')
            .subscribe((result: boolean) => {
                console.log(result);
                if (result) {
                    form.reset({
                        title: this.divisions.selected().title
                    });
                    this.detector.detectChanges();
                    this.modals.get('edit-division-modal').close();
                }
            });
    };


    openDeleteDivisionModal(): void {
        this.modals.get('delete-division-modal').open();
    };


    deleteDivision(): void {
        this.divisions.delete(this.divisions.selected().id, this.session.session ? this.session.session.token : '')
            .subscribe((result: boolean) => {
                if (result) {
                    this.divisions.new().parentId = 0;
                    const tree = this.trees.getById('phone-book-divisions');
                    if (tree) {
                        tree.deleteDivision(this.divisions.selected());
                    }
                    this.divisions.selected(null);
                    //this.phoneBook.selectedDivision = null;
                    this.phoneBook.contacts = [];
                    this.modals.get('delete-division-modal').close();
                }
            });

        /*
        this.manager.deleteDivision(
            this.phoneBook.selectedDivision.id,
            this.session.session ? this.session.session.token : ''
        ).subscribe((result: boolean) => {
            if (result === true) {
                const tree = this.trees.getById('phone-book-divisions');
                if (tree) {
                    tree.deleteDivision(this.phoneBook.selectedDivision);
                }
                this.phoneBook.selectedDivision = null;
                this.phoneBook.contacts = [];
                this.modals.get('delete-division-modal').close();
            }
        });
        */
    };





    /**
     * Открытие модального окна редактирования данных абонента
     */
    openEditContactModal(): void {};


    /**
     * Отвязка выбранного абонента от пользователя
     * @param form {any} - форма редактирования данных абонента
     */
    clearSelectedContactUser(form: any): void {
        if (this.phoneBook.selectedContact) {
            this.selectedContactUserBackup = this.phoneBook.selectedContact.user;
            this.phoneBook.selectedContact.userId = 0;
            this.phoneBook.selectedContact.user = null;
        } else {
            this.newContact.restoreBackup();
            this.newContact.user = null;
        }
        form.form.markAsDirty();
    };


    editContact(): void {
        this.manager.editContact(this.phoneBook.selectedContact, this.session.session ? this.session.session.token : '')
            .subscribe(() => {
                this.phoneBook.selectedContact.positionTrimmed =
                    this.phoneBook.selectedContact.position.length > 55
                        ? this.phoneBook.selectedContact.position.substr(0, 55) + '...'
                        : this.phoneBook.selectedContact.position;
                this.phoneBook.selectedContact.setupBackup(['userId', 'surname', 'name', 'fname', 'position', 'positionTrimmed', 'email', 'mobile']);
                this.modals.get('edit-contact-modal').close();
                this.phoneBook.selectedContact = null;
            });
    };


    /**
     * Закрытие модального окна редактирования данных абонента, отмена изменений
     * @param form {any} - форма редактирования данных абонента
     */
    closeEditContactModal(form: any): void {
        if (this.phoneBook.selectedContact) {
            this.phoneBook.selectedContact.restoreBackup();
            if (this.selectedContactUserBackup) {
                this.phoneBook.selectedContact.user = this.selectedContactUserBackup;
                this.selectedContactUserBackup = null;
            } else {
                this.phoneBook.selectedContact.user = null;
            }
        }
        this.phoneBook.selectedContact = null;
    };





    /**
     * Открытие модального окна добавления абоненту нового номера телефона
     */
    openNewContactPhoneModal(): void {
        this.modals.get('new-contact-phone-modal').open();
    };





    cancelPhoneChanges(phone: Phone, form: NgForm): void {
        phone.restoreBackup();
        form.reset({
            ats: phone.atsId,
            phone: phone.number
        });
    };


    /**
     * Закрытие модального окна добавления абоненту нового номера телефона
     * @param form {NgForm}
     */
    closeNewContactPhoneModal(form: NgForm): void {
        this.newContactPhone.restoreBackup();
        form.form.reset({
            ats: 0
        });
    };


    /**
     * Добавление абоненту нового номера телефона
     */
    addContactPhone(): void {
        this.manager.addContactPhone(
            this.phoneBook.selectedContact.id,
            this.newContactPhone.atsId,
            this.newContactPhone.number,
            this.phoneBook.selectedAts.id)
            .subscribe((phone: Phone) => {
                if (this.phoneBook.selectedContact.visiblePhones.length < 2) {
                    this.phoneBook.selectedContact.visiblePhones.push(phone);
                }
                this.phoneBook.selectedContact.phones.push(phone);
                this.modals.get('new-contact-phone-modal').close();
            });
    };


    /**
     * Открытие модального окна изменения контактного телефона абонента
     * @param {Phone} phone - Изменяемый контактный телефон абоеннта
     */
    openEditContactPhoneModal(phone: Phone): void {
        this.phoneBook.selectedContactPhone = phone;
        console.log(this.phoneBook.selectedContactPhone);
        this.modals.get('edit-contact-phone-modal').open();
    };


    /**
     * Закрытие модального окна изменения контактного телефона абонента
     * @param {NgForm} form - Форма изменения контактного телефона абонента
     */
    closeEditContactPhoneModal(form: NgForm): void {
        this.phoneBook.selectedContactPhone.restoreBackup();
    };


    /**
     * Изменение контактного телефона абонента
     */
    editContactPhone(): void {
        this.manager.editContactPhone(this.phoneBook.selectedContactPhone).subscribe(() => {
            this.modals.get('edit-contact-phone-modal').close();
        });
    };


    /**
     * Открытие модального окна удаления контактного телефона абонента
     * @param {Phone} phone - Удаляемый контактный телефон
     */
    openDeleteContactPhoneModal(phone: Phone): void {
        this.phoneBook.selectedContactPhone = phone;
        this.modals.get('delete-contact-phone-modal').open();
    };


    /**
     * Закрытие модального окна удаленния контакта
     */
    closeDeleteContactModal(): void {
        this.phoneBook.selectedContact = null;
    };


    /**
     * Удаление контактного телефона абонента
     * @param {Phone} phone - Удаляемый телефон
     */
    deleteContactPhone(phone: Phone): void {
        this.phoneBook.selectedContactPhone = phone;
        this.manager.deleteContactPhone(phone).subscribe((result: boolean) => {
            if (result) {
                this.phoneBook.selectedContact.phones.forEach((item: Phone, index: number, phones: Phone[]) => {
                    if (item.id === phone.id) {
                        phones.splice(index, 1);
                    }
                });
                this.phoneBook.selectedContact.visiblePhones.forEach((item: Phone, index: number, phones: Phone[]) => {
                    if (item.id === phone.id) {
                        phones.splice(index, 1);
                    }
                });
                this.phoneBook.selectedContactPhone = null;
                this.modals.get('delete-contact-phone-modal').close();
            }
        });
    };


    /**
     * Удаление абонента
     */
    deleteContact(): void {
        this.manager.deleteContact(this.phoneBook.selectedContact).subscribe((result: boolean) => {
            if (result) {
                this.modals.get('delete-contact-modal').close();
                this.phoneBook.contacts.forEach((group: ContactGroup) => {
                    for (let contact in group.contacts) {
                        if (group.contacts[contact].id === this.phoneBook.selectedContact.id) {
                            group.contacts.splice(+contact, 1);
                            this.phoneBook.selectedContact = null;
                            break;
                        }
                    }
                });
            }
        });
    };


    /**
     * Открытие модального окна управлениями офисами организации
     */
    openOfficesModal(): void {
        this.modals.get('offices-modal').open();
    };















    /**
     * Закрытие модального окна оповещения о загрузке фото абонента
     */
    closeContactPhotoUploadedModal(): void {
        this.modals.get('contact-photo-uploaded-modal').close();
    };
}
