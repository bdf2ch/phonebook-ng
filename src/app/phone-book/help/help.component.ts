import { Component } from '@angular/core';
import { PhoneBookService } from "../phone-book.service";


@Component({
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.css']
})
export class HelpComponent {
    private container: any;

    constructor(private phoneBook: PhoneBookService) {
        this.container = document.getElementById('help-content');
        this.phoneBook.allowToAddContacts = false;
    };

    scrollTo(id: string): void {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView();
        }
    };
}
