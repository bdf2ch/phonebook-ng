import { Component } from '@angular/core';
import { SessionService } from '../session.service';
import { PhoneBookService } from '../phone-book.service';


@Component({
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {

    /**
     * Конструктор
     * @param session {SessionService} - SessionService injector
     * @param phoneBook {PhoneBookService} - PhoneBookService injector
     */
    constructor(private session: SessionService,
                private phoneBook: PhoneBookService) {
        this.phoneBook.isInUserAccountMode = true;
        this.phoneBook.isInFavoritesMode = false;
    };

}