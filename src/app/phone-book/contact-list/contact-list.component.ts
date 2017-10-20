import { Component, ElementRef, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { PhoneBookService } from "../phone-book.service";
import { User } from '../../models/user.model';
import { PhoneBookManagerService } from '../../manager/phone-book-manager.service';


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
                private phoneBook: PhoneBookService,
                private manager: PhoneBookManagerService) {
        this.container = document.getElementById('app-content');
    };


    ngOnInit(): void {

    };


    ngAfterViewChecked(): void {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        this.detector.detectChanges();
    };
}
