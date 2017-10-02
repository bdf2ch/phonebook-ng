import {
    Component, ElementRef, HostListener, AfterContentChecked, OnInit, AfterViewInit,
    AfterViewChecked, ChangeDetectorRef, ViewChild, ViewContainerRef, ViewChildren, QueryList
} from '@angular/core';
import { SessionService } from "../session.service";
import {Contact} from "../../models/contact.model";
import {ContactGroup} from "../../models/contact-group.model";
import {ContactGroupComponent} from "../contact-group/contact-group.component";
import {ContactComponent} from "../contact/contact.component";
import {PhoneBookService} from "../phone-book.service";


@Component({
    templateUrl: './favorite-contacts.component.html',
    styleUrls: ['./favorite-contacts.component.css']
})
export class FavoriteContactsComponent implements OnInit, AfterViewInit, AfterViewChecked {
    ngAfterViewChecked(): void {
        //console.log('children', this.group);
        this.contacts.forEach((value: ContactComponent, index: number, array: ContactComponent[]) => {
            console.log('contact', value);
            value.element.nativeElement.children[0].style.border = '1px solid red';
        });
    }

    container: any;
    row: number = 0;
    margin: number = 0;
    @ViewChildren(ContactComponent) contacts: ContactComponent[];


    ngOnInit(): void {
        document.getElementById('app-content-wrapper').scrollTop = 0;
        //this.phoneBook.setFavoritesMode();
        this.phoneBook.favoriteContactsMode(true);
        //this.detector.detectChanges();
    };

    ngAfterViewInit(): void {
        //console.log('children', this.group);
        //console.log('clientWidth', this.container.clientWidth);
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        this.detector.detectChanges();
        //console.log('clientWidth', this.container.clientWidth);
        //console.log('width', width);
        //console.log('margin', this.margin);
        //console.log('row', this.row);
    }




    constructor(private detector: ChangeDetectorRef,
                private element: ElementRef,
                private session: SessionService,
                private phoneBook: PhoneBookService) {
        this.container = document.getElementById('app-content');
        this.phoneBook.favoriteContactsMode(true);
        //let width = this.container.clientWidth - 40;
        //this.row = Math.floor(width / 280);
        //this.margin = (width - this.row * 280) / (this.row - 1);
        //console.log(this.container);
    };

    @HostListener('window:resize', ['$event']) onWindowResize (event: any) {
        //if (this.element.nativeElement.children[0]) {
            console.log(this.container.clientWidth);
            let width = this.container.clientWidth - 40;
            //let width = this.element.nativeElement.children[0].clientWidth - 40;
            this.row = Math.floor(width / 260);
            this.margin = (width - this.row * 260) / (this.row - 1);
         //}
    };

};