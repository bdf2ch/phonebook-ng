import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
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
    //@ViewChild(ContactListComponent) list: ContactListComponent;
    private newDivision: Division = new Division();


    constructor(private phoneBook: PhoneBookService,
                private manager: PhoneBookManagerService,
                private trees: DivisionTreeService,
                private session: SessionService,
                private modals: ModalService) {
        this.newDivision.parentId = appConfig.defaultOrganizationId;
        this.newDivision.setupBackup(['parentId', 'title']);
        console.log('new division', this.newDivision);
    };


    /**
     * Инициализация компонента.
     * При наличии избранных контактов у текущего пользователя - показываем избранные контакты
     */
    ngOnInit(): void {
        if (this.phoneBook.favorites.contacts.length > 0) {
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
        this.phoneBook.selectedContact = null;
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


    onChangeUserPhotoPosition(position: IContactPhotoPosition): void {
        this.phoneBook.setContactPhotoPosition(this.session.user.id, position.top, position.left, position.zoom)
            .subscribe((pos: IContactPhotoPosition) => {
                this.session.user.setPhotoPosition(pos.left, pos.top)
            });
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

};
