import { Component, ElementRef, OnInit, AfterViewChecked, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ModalsService } from '@bdf2ch/angular-transistor';
import { PhoneBookService } from "../../shared/phone-book/phone-book.service";
import { PhoneBookManagerService } from '../../manager/phone-book-manager.service';
import { ContactsService } from "../contacts.service";
import { SessionService } from '../../shared/session/session.service';
import { OrganizationsService } from '../../shared/organizations/organizations.service';
import { DivisionsService } from "../../shared/divisions/divisions.service";
import { Contact } from "../../models/contact.model";
import { User } from '../../models/user.model';
import {appConfig} from "../../app.config";


@Component({
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, AfterViewChecked {
    row: number;
    margin: number;
    container: any;
    private users: User[] = [];
    @HostListener('window:resize', ['$event']) onResize(event: any) {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        console.log('margin', this.margin);
        this.detector.detectChanges();
    };


    constructor(private detector: ChangeDetectorRef,
                private router: Router,
                private route: ActivatedRoute,
                private element: ElementRef,
                private modals: ModalsService,
                private session: SessionService,
                private phoneBook: PhoneBookService,
                private manager: PhoneBookManagerService,
                private organizations: OrganizationsService,
                private divisions: DivisionsService,
                private contacts: ContactsService
                ) {
        this.container = document.getElementById('app-content');
    };


    ngOnInit(): void {
        /*
        if (!this.divisions.selected && this.phoneBook.favorites.contacts.length > 0 && this.contacts.searchQuery === '') {
            //this.phoneBook.isInFavoritesMode = true;
            this.router.navigate(['favorites'])
        }
        */


        /*
        this.route.paramMap
            //.switchMap((params: ParamMap) =>  this.contacts.getByDivisionIdRecursive(+params.get('divisionId'), 17, this.session.session && this.session.session.token ? this.session.session.token : ''))
            .subscribe((val: any) => {
                console.log('val', val);
                this.contacts.getByDivisionIdRecursive(+val.params.divisionId, appConfig.defaultSourceAtsId, this.session.session ? this.session.session.token : '').subscribe();
            });
            */
    };


    ngAfterViewChecked(): void {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        //console.log('margin', this.margin);
        this.detector.detectChanges();
    };



    /**
     * Открытие модального окна добавления нового абонента
     */
    openNewContactModal(): void {
        this.modals.get('new-contact-modal').open();
    };


    /**
     * Закрытие модального окна добавления нового абонента, очистка формы.
     * @param form {any} - форма добавления нового абонента
     */
    closeNewContactModal(form?: any): void {
        this.contacts.new().restoreBackup();
        this.contacts.new().user = null;
        if (form) {
            form.reset({
                surname: this.contacts.new().surname,
                name: this.contacts.new().name,
                fname: this.contacts.new().fname,
                position: this.contacts.new().position,
                email: this.contacts.new().email,
                mobile: this.contacts.new().mobile,
                office: this.contacts.new().officeId,
                room: this.contacts.new().room,
                order: this.contacts.new().order
            });
        }
    };


    /**
     * Добавление нового абонента
     */
    addContact(): void {
        this.contacts.new().divisionId = this.divisions.selected() ? this.divisions.selected().id : this.organizations.selected().id;
        this.contacts.add(this.contacts.new(), this.session.session ? this.session.session.token : '')
            .subscribe((result: Contact | boolean) => {
                if (result !== false) {
                    this.contacts.getByDivisionIdRecursive(this.divisions.selected().id, this.phoneBook.selectedAts.id, this.session.session ? this.session.session.token : '')
                        .subscribe(() => {
                            this.modals.get('new-contact-modal').close();
                        });
                }
            });
    };


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
            this.contacts.new().user = user;
            this.contacts.new().userId = user.id;
            this.contacts.new().surname = user.surname;
            this.contacts.new().name = user.name;
            this.contacts.new().fname = user.fname;
            this.contacts.new().position = user.position;
            this.contacts.new().email = user.email;
            this.contacts.new().photo = user.photo;
        } else {
            this.phoneBook.selectedContact.userId = user.id;
            this.phoneBook.selectedContact.user = user;
            form.form.markAsDirty();
        }
    };


    onResetUserSearch(): void {
        console.log('reset typeahead');
        this.users = [];
        this.contacts.new().restoreBackup();
    };
}
