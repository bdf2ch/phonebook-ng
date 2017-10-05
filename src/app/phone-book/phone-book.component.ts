import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { PhoneBookService } from './phone-book.service';
import { SessionService } from "./session.service";
import { Division } from "../models/Division.model";
import { ContactListComponent } from "./contact-list/contact-list.component";
import {Contact} from "../models/contact.model";


@Component({
    templateUrl: './phone-book.component.html',
    styleUrls: ['./phone-book.component.css']
})
export class PhoneBookComponent implements  OnInit {
    private inAuthMode: boolean = false;
    private inUserMenuMode: boolean = false;
    private inEditContactMode: boolean = true;
    private isAtsPanelOpened: boolean = false;
    private sourceAtsId: number;
    private snapshot: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    //@ViewChild(ContactListComponent) list: ContactListComponent;


    constructor(private router: Router,
                private route: ActivatedRoute,
                private phoneBook: PhoneBookService,
                private session: SessionService) {};


    /**
     * Инициализация компонента.
     * При наличии избранных контактов у текущего пользователя - редирект на /favorites
     */
    ngOnInit(): void {
        if (this.phoneBook.favorites.contacts.length > 0) {
            console.log('redirect to favs');
            //this.router.navigate(['/favorites']);
            //this.phoneBook.setFavoritesMode();
            this.phoneBook.isInFavoritesMode = true;
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
        //this.phoneBook.isInFavoritesMode = false;
        this.phoneBook.selectedDivision = division;
        if (division !== null) {
            //this.router.navigate(['/']);

            this.phoneBook.fetchContactsByDivisionId(division.id, this.phoneBook.selectedAts.id, this.session.session ? this.session.session.token : '').subscribe(() => {
                document.getElementById('app-content').scrollTop = 0;
                this.phoneBook.searchQuery = '';
                if (this.isAtsPanelOpened) {
                    this.isAtsPanelOpened = false;
                }
            })
        } else {
            //this.phoneBook.clearContactGroups();
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
                this.phoneBook.fetchContactsByDivisionId(this.phoneBook.selectedDivision.id, this.phoneBook.selectedAts.id, this.session.session ? this.session.session.token : '')
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

};
