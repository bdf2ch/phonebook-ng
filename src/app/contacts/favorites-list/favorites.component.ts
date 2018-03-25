import {AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { PhoneBookService } from '../../shared/phone-book/phone-book.service';
import {ContactsService} from "../contacts.service";
import {Observable} from "rxjs/Observable";
import {ContactGroup} from "../../models/contact-group.model";
import {SessionService} from "../../shared/session/session.service";


@Component({
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements AfterViewChecked, OnInit {
    row: number;
    margin: number;
    private container: any;

    constructor(private phoneBook: PhoneBookService,
                private detector: ChangeDetectorRef,
                private session: SessionService,
                private contacts: ContactsService) {
        this.container = document.getElementById('app-content');
        this.phoneBook.isInFavoritesMode = true;
        this.phoneBook.isInUserAccountMode = false;
        this.phoneBook.allowToAddContacts = false;
        this.contacts.clearSearch();
    };

    ngOnInit(): void {
        //this.contacts.clearSearch();
        //this.contacts.searchQuery = '';
        //this.detector.detectChanges();

    }

    ngAfterViewChecked(): void {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        this.detector.detectChanges();
    };

    @HostListener('window:resize', ['$event']) onResize(event: any) {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        //console.log('margin', this.margin);
        this.detector.detectChanges();
    };
};