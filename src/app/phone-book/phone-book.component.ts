import { Component } from '@angular/core';
import { PhoneBookService } from './phone-book.service';
import { Division } from "../models/Division.model";


@Component({
    templateUrl: './phone-book.component.html',
    styleUrls: ['./phone-book.component.css']
})
export class PhoneBookComponent {
    private inAuthMode: boolean = true;

    constructor(private phoneBook: PhoneBookService) {};

    openAuthModal(): void {
        this.inAuthMode = true;
    };

    closeAuthModal(): void {
        this.inAuthMode = false;
    };

    selectDivision(division: Division): void {
        //console.log(division);
        if (division !== null) {
            this.phoneBook.fetchContactsByDivisionId(division.id).subscribe(() => {
                //document.getElementById('app-contacts').scrollTop = 0;
            })
        } else {
            this.phoneBook.clearContactGroups();
        }
        ;
    };

};
