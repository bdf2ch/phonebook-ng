import { Component } from '@angular/core';
import { PhoneBookService } from './phone-book.service';
import { Division } from "../models/Division.model";


@Component({
    templateUrl: './phone-book.component.html',
    styleUrls: ['./phone-book.component.css']
})
export class PhoneBookComponent {

    constructor(private phoneBook: PhoneBookService) {};

    selectDivision(division: Division): void {
        //console.log(division);
        this.phoneBook.fetchContactsByDivisionId(division.id).subscribe();
    };

};
