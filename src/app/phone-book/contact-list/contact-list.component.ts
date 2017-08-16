import { Component, ElementRef, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { PhoneBookService } from "../phone-book.service";


@Component({
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, AfterViewChecked {
    row: number;
    margin: number;
    container: any;


    constructor(private detector: ChangeDetectorRef,
                private element: ElementRef,
                private phoneBook: PhoneBookService) {
        this.container = document.getElementById('app-content');
    };


    ngOnInit(): void {
        this.phoneBook.favoritesMode(false);
    };


    ngAfterViewChecked(): void {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 280);
        this.margin = (width - this.row * 280) / (this.row - 1);
        this.detector.detectChanges();
    };
};
