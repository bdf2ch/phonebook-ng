import {
    Component, Input, ElementRef, OnChanges, SimpleChanges, ViewChild, AfterViewInit,
    ViewChildren
} from '@angular/core';
import { ContactGroup } from "../../models/contact-group.model";
import {PhoneBookService} from "../phone-book.service";
import {ContactComponent} from "../contact/contact.component";
import {Contact} from "../../models/contact.model";
import {Division} from "../../models/division.model";
import { SessionService } from '../session.service';


@Component({
    selector: 'contact-group',
    templateUrl: './contact-group.component.html',
    styleUrls: ['./contact-group.component.css']
})
export class ContactGroupComponent implements OnChanges, AfterViewInit {
    ngAfterViewInit(): void {
        //console.log('contacts', this.contacts);

    }

    @Input() group: ContactGroup;
    @Input() margin: number;
    @Input() row: number;
    //@ViewChildren(ContactComponent) contacts: ContactComponent[];


    constructor(private element: ElementRef,
                private session: SessionService,
                private phoneBook: PhoneBookService) {};


    ngOnChanges(changes: SimpleChanges): void {
        //if (changes['margin'] !== undefined)
        //    this.contactMargin = changes['margin']['currentValue'];
        //if (changes['contactsInRow'] !== undefined)
        //    this.inRow = changes['contactsInRow']['currentValue'];
        //console.log('cg margin', this.contactMargin);
    };


    selectDivision(division: Division): void {
        this.phoneBook.selectedDivision = division;
        this.phoneBook.fetchContactsByDivisionId(division.id, this.phoneBook.selectedAts.id, this.session.session ? this.session.session.token : '')
            .subscribe(() => {
                this.phoneBook.searchQuery = '';
            });
    };


    /**
     * Удаляет абонента из группы
     * @param contact
     */
    removeContact(contact: Contact): void {
        this.group.contacts.forEach((item: Contact, index: number, array: Contact[]) => {
            if (item.id === contact.id) {
                array.splice(index, 1);
            }
        });
    };

};