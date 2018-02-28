import { Component, ElementRef, OnInit, AfterViewChecked, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PhoneBookService } from "../../phone-book/phone-book.service";
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
    @HostListener('window:resize', ['$event']) onResize(event: any) {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        console.log('margin', this.margin);
        this.detector.detectChanges();
    };


    constructor(private detector: ChangeDetectorRef,
                private element: ElementRef,
                private phoneBook: PhoneBookService,
                private manager: PhoneBookManagerService,
                private router: Router) {
        this.container = document.getElementById('app-content');
    };


    ngOnInit(): void {
        if (!this.phoneBook.selectedDivision && this.phoneBook.favorites.contacts.length > 0 && !this.phoneBook.isInSearchMode) {
            //this.phoneBook.isInFavoritesMode = true;
            this.router.navigate(['favorites'])
        }
    };


    ngAfterViewChecked(): void {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        //console.log('margin', this.margin);
        this.detector.detectChanges();
    };
}
