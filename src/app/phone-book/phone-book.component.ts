import { Component, OnInit, ViewChild, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { appConfig } from '../app.config';
import { PhoneBookService } from './phone-book.service';
import { SessionService } from "./session.service";
import { Division } from "../models/division.model";
import { ContactListComponent } from "./contact-list/contact-list.component";
import {Contact} from "../models/contact.model";
import { IContactPhotoPosition } from '../models/user-photo-position.interface';
import { ModalService } from '../utilities/modal/modal.service';
import { PhoneBookManagerService } from '../manager/phone-book-manager.service';
import { DivisionTreeService } from './division-tree/division-tree.service';
import { ContactGroup } from '../models/contact-group.model';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/observable/of';
import { Subject } from "rxjs/Subject";
import { isError } from "../models/error.model";
import { CookieService } from '../utilities/cookies/cookie.services';
import { Phone } from '../models/phone.model';
import { NgForm } from '@angular/forms';

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
    private newDivision: Division = new Division();
    private newContact: Contact = new Contact();
    private newContactPhone: Phone = new Phone();
    private users: User[] = [];
    private usersStream: Observable<User[]>;
    private searchTerms = new Subject<string>();
    private usersSearchQuery: string = '';
    private selectedContactUserBackup: User | null = null;
    private authorization = {
        login: '',
        password: '',
        userNotFound: false
    };


    constructor(private phoneBook: PhoneBookService,
                private manager: PhoneBookManagerService,
                private trees: DivisionTreeService,
                private session: SessionService,
                private cookies: CookieService,
                private modals: ModalService,
                private router: Router) {
        this.newDivision.parentId = appConfig.defaultOrganizationId;
        this.newDivision.setupBackup(['parentId', 'title']);
        this.newContact.setupBackup(['userId', 'surname', 'name', 'fname', 'position', 'email', 'mobile']);
        this.newContactPhone.setupBackup(['atsId', 'number']);
    };


    /**
     * Инициализация компонента.
     * При наличии избранных контактов у текущего пользователя - показываем избранные контакты
     */
    ngOnInit(): void {
        //if (this.phoneBook.favorites.contacts.length > 0) {
            //this.phoneBook.isInFavoritesMode = true;
        //    this.router.navigate(['favorites'])
        //}
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
        this.modals.open('authorization-modal');
    };


    /**
     * Авторизация пользователя
     */
    login(): void {
        this.session.logIn(this.authorization.login, this.authorization.password).subscribe((result: any) => {
            if (!isError(result)) {
                console.log('result', result);
                this.authorization.userNotFound = false;
                this.cookies.set({
                    name: 'kolenergo',
                    value: result.session.token
                });
                this.modals.close();
            } else {
                this.authorization.userNotFound = true;
                console.log('USER NOT FOUND');
            }
        });
    };


    /**
     * Закрывает модальное окно авторизации пользователя
     */
    closeAuthModal(): void {
        this.authorization.login = '';
        this.authorization.password = '';
        this.authorization.userNotFound = false;
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
     * PЗакрывает панель выбора АТС
     */
    closeAtsPanel(): void {
        this.isAtsPanelOpened = false;
    };


    selectDivision(division: Division): void {
        this.router.navigate(['/']);
        //console.log(division);
        //this.phoneBook.isInFavoritesMode = false;
        this.phoneBook.selectedDivision = division;
        if (division !== null) {
            this.newDivision.parentId = division.id;

            this.phoneBook.fetchContactsByDivisionIdRecursive(division.id, this.phoneBook.selectedAts.id, this.session.session ? this.session.session.token : '').subscribe(() => {
                document.getElementById('app-content').scrollTop = 0;
                this.phoneBook.searchQuery = '';
                if (this.isAtsPanelOpened) {
                    this.isAtsPanelOpened = false;
                }
            })
        } else {
            //this.phoneBook.clearContactGroups();
            this.newDivision.parentId = 0;
            this.phoneBook.contacts = [];
        };
    };


    searchContacts(value: string): void {
        console.log('search query = ', value);
        if (value.length >= 3) {

            this.phoneBook.searchContacts(this.session.user ? this.session.user.id : 0).subscribe();
        }
    };



    selectAts(): void {
        console.log('ats changed');
        if (this.phoneBook.searchQuery.length > 3) {
            this.phoneBook.searchContacts().subscribe();
        } else {
            //console.log(this.route);

            if (this.phoneBook.isInFavoritesMode) {
                this.phoneBook.fetchFavoriteContacts(this.session.user !== null ? this.session.user.id : 0, this.phoneBook.selectedAts.id)
                    .subscribe(() => {

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


    onChangeContactPhotoPosition(position: IContactPhotoPosition): void {
        console.log(position);
        //this.phoneBook.setContactPhotoPosition(this.phoneBook.selectedContact.id, position.photo_top, position.photo_left, position.photo_zoom)
        //    .subscribe((pos: IContactPhotoPosition) => {
                this.phoneBook.selectedContact.setPhotoPosition(position);
        //    });
    };



    onCancelContactPosition(position: IContactPhotoPosition): void {
        this.phoneBook.selectedContact.setPhotoPosition(position);
    };



    openNewDivisionModal(): void {
        this.newDivision.parentId = this.phoneBook.selectedDivision ? this.phoneBook.selectedDivision.id : 0;
        this.modals.open('new-division-modal');
    };


    closeNewDivisionModal(form?: any): void {
        this.newDivision.restoreBackup();
        if (form)
            form.reset();
    };


    addDivision(): void {
        this.manager.addDivision(this.newDivision).subscribe((division: Division) => {
            this.trees.addDivision('phone-book-divisions', division);
            this.modals.close(false);
        });
    };


    openEditDivisionModal(): void {
        this.modals.open('edit-division-modal');
    };


    closeEditDivisionModal(form?: any): void {
        this.phoneBook.selectedDivision.restoreBackup();
        if (form)
            form.reset({
                title: this.phoneBook.selectedDivision.title
            });
    };


    editDivision(): void {
        this.manager.editDivision(this.phoneBook.selectedDivision).subscribe((result: boolean) => {
            if (result) {
                this.modals.close(false);
            }
        });
    };


    openDeleteDivisionModal(): void {
        this.modals.open('delete-division-modal');
    };


    /**
     * открытие модального окна добавления нового абонента
     */
    openNewContactModal(): void {
        this.modals.open('new-contact-modal');
    };


    /**
     * Закрытие модального окна добавления нового абонента, очистка формы.
     * @param form {any} - форма добавления нового абонента
     */
    closeNewContactModal(form?: any): void {
        this.newContact.restoreBackup();
        if (form) {
            form.reset({
                surname: this.newContact.surname,
                name: this.newContact.name,
                fname: this.newContact.fname,
                position: this.newContact.position,
                email: this.newContact.email,
                mobile: this.newContact.mobile
            });
        }
    };


    /**
     * Добавление нового абонента
     */
    addContact(): void {
        this.newContact.divisionId = this.phoneBook.selectedDivision ? this.phoneBook.selectedDivision.id : this.phoneBook.selectedOrganization.id;
        this.manager.addContact(this.newContact).subscribe((contact: Contact) => {
            console.log('new contact', contact);
            this.phoneBook.contacts.forEach((item: ContactGroup, index: number, array: ContactGroup[]) => {
                if (this.newContact.divisionId === item.divisions[item.divisions.length - 1].id) {
                    item.contacts.push(contact);
                }
            });
            this.modals.close();
        });
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
        this.selectedContactUserBackup = this.phoneBook.selectedContact.user;
        this.phoneBook.selectedContact.userId = 0;
        this.phoneBook.selectedContact.user = null;
        form.form.markAsDirty();
    };


    editContact(): void {
        this.manager.editContact(this.phoneBook.selectedContact)
            .subscribe(() => {
                this.phoneBook.selectedContact.setupBackup(['userId', 'surname', 'name', 'fname', 'position', 'email', 'mobile']);
                this.modals.close(true);
                this.phoneBook.selectedContact = null;
            });
    };


    /**
     * Закрытие модального окна редактирования данных абонента, отмена изменений
     * @param form {any} - форма редактирования данных абонента
     */
    closeEditContactModal(form: any): void {
        //this.modals.close(true);
        this.phoneBook.selectedContact.restoreBackup();
        if (this.selectedContactUserBackup) {
            this.phoneBook.selectedContact.user = this.selectedContactUserBackup;
            this.selectedContactUserBackup = null;
        } else {
            this.phoneBook.selectedContact.user = null;
        }
        this.phoneBook.selectedContact = null;
    };


// Push a search term into the observable stream.
    search(term: string): void {
        this.searchTerms.next(term);
    }


    onUserSearchChange(text: string): void {
        console.log('text', text);
        this.manager.searchUsers(text)
            .subscribe((users: User[]) => {
                console.log(users);
                this.users = users;
            });
    };


    onUserSearchSelect(user: User, form?: any): void {
        this.users = [];
        if (!this.phoneBook.selectedContact) {
            this.newContact.userId = user.id;
            this.newContact.surname = user.surname;
            this.newContact.name = user.name;
            this.newContact.fname = user.fname;
            this.newContact.position = user.position;
            this.newContact.email = user.email;
        } else {
            this.phoneBook.selectedContact.userId = user.id;
            this.phoneBook.selectedContact.user = user;
            form.form.markAsDirty();
        }
    };


    onResetUserSearch(): void {
        console.log('reset typeahead');
        this.users = [];
        this.newContact.restoreBackup();
    };


    /**
     * Открытие модального окна добавления абоненту нового номера телефона
     */
    openNewContactPhoneModal(): void {
        this.modals.open('new-contact-phone-modal');
    };


    /**
     * Добавление абоненту нового номера телефона
     */
    addContactPhone(): void {
        this.manager.addContactPhone(
            this.phoneBook.selectedContact.id,
            this.newContactPhone.atsId,
            this.newContactPhone.number)
            .subscribe((phone: Phone) => {
                this.phoneBook.selectedContact.phones.push(phone);
                this.modals.close();
            });
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


    openEditContactPhoneModal(phone: Phone): void {
        this.phoneBook.selectedContactPhone = phone;
        this.modals.open('edit-contact-phone-modal');
    };


    closeEditContactPhoneModal(form: NgForm): void {
        this.modals.close(true);
        this.phoneBook.selectedContactPhone.restoreBackup();
    };



    openDeleteContactPhoneModal(): void {
        this.modals.open('delete-contact-phone-modal');
    };


    closeDeleteContactPhoneModal(): void {
        this.modals.close(true);
    };


};
