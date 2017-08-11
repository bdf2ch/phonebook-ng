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
    ngAfterContentInit(): void {
        console.log('list', this.list);
    }

    private inAuthMode: boolean = false;
    private inUserMenuMode: boolean = false;
    private inEditContactMode: boolean = true;
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


    selectDivision(division: Division): void {
        //console.log(division);
        this.phoneBook.selectedDivision(division);
        if (division !== null) {
            this.router.navigate(['/']);
            this.phoneBook.fetchContactsByDivisionId(division.id).subscribe(() => {
                document.getElementById('app-content-wrapper').scrollTop = 0;
            })
        } else {
            this.phoneBook.clearContactGroups();
        }
        ;
    };


    searchContacts(value: string): void {
        console.log('search query = ', value);
        if (value.length >= 3) {
            this.phoneBook.searchContacts().subscribe(() => {
                this.router.navigate(['/']);
            });
        }
    };

};
