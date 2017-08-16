import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { PhoneBookService } from './phone-book.service';
import { SessionService } from "../utilities/session/session.service";
import { Division } from "../models/Division.model";
import { ContactListComponent } from "./contact-list/contact-list.component";
import {Contact} from "../models/contact.model";


@Component({
    templateUrl: './phone-book.component.html',
    styleUrls: ['./phone-book.component.css']
})
export class PhoneBookComponent implements  OnInit, AfterContentInit {
    private inAuthMode: boolean = false;
    private inUserMenuMode: boolean = false;
    private inEditContactMode: boolean = true;
    private isAtsPanelOpened: boolean = false;
    private sourceAtsId: number;
    private snapshot: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    @ViewChild(ContactListComponent) list: ContactListComponent;


    constructor(private router: Router,
                private phoneBook: PhoneBookService,
                private session: SessionService) {};


    /**
     * Инициализация компонента.
     * При наличии избранных контактов у текущего пользователя - редирект на /favorites
     */
    ngOnInit(): void {
        if (this.session.user() && this.session.user().favorites.contacts.length > 0) {
            console.log('redirect to favs');
            this.router.navigate(['/favorites']);
        }

    };


    ngAfterContentInit(): void {
        console.log('list', this.list);
    }


    /**
     * Открывает модальное окно авторизации пользователя
     */
    openAuthModal(): void {
        this.inAuthMode = true;
    };


    /**
     * Закрывает модальное окно авторизации пользователя
     */
    closeAuthModal(): void {
        this.inAuthMode = false;
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
    openEditContactModal(): void {
        this.inEditContactMode = true;
    };


    /**
     * Закрывает модальное окно редактирования данных выбранного пользователя
     */
    closeEditContactModal(): void {
        this.phoneBook.selectedContact(null);
        this.inEditContactMode = false;
    };


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
        //console.log(division);
        this.phoneBook.selectedDivision(division);
        if (division !== null) {
            this.router.navigate(['/']);
            this.phoneBook.fetchContactsByDivisionId(division.id, this.phoneBook.selectedATS().id).subscribe(() => {
                document.getElementById('app-content').scrollTop = 0;
                this.phoneBook.searchQuery = '';
                if (this.isAtsPanelOpened) {
                    this.isAtsPanelOpened = false;
                }
            })
        } else {
            this.phoneBook.clearContactGroups();
        };
    };


    searchContacts(value: string): void {
        console.log('search query = ', value);
        if (value.length >= 3) {
            this.phoneBook.searchContacts().subscribe(() => {
                this.router.navigate(['/']);
            });
        }
    };


    selectSourceAts(): void {
        console.log('changed');
        if (this.phoneBook.searchQuery.length > 3) {
            this.phoneBook.searchContacts().subscribe();
        } else {
            this.phoneBook.fetchContactsByDivisionId(this.phoneBook.selectedDivision().id, this.phoneBook.selectedATS().id)
                .subscribe();
        }
    };

};
