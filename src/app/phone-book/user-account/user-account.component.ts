import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { PhoneBookService } from '../phone-book.service';


@Component({
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit{

    /**
     * Конструктор
     * @param session {SessionService} - SessionService injector
     * @param phoneBook {PhoneBookService} - PhoneBookService injector
     */
    constructor(private session: SessionService,
                private phoneBook: PhoneBookService) {};


    ngOnInit(): void {
        this.phoneBook.isInUserAccountMode = true;
    };
}