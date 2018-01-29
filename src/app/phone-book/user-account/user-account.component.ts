import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    constructor(private router: Router,
                private session: SessionService,
                private phoneBook: PhoneBookService) {
        this.phoneBook.isInUserAccountMode = true;
        this.phoneBook.isInFavoritesMode = false;
    };


    uploadPhoto(event: any): void {
        if (this.session.user) {
            console.log('userId', this.session.user.id);
            console.log('file', event.target.files[0]);
            this.phoneBook.uploadContactPhotoForModeration(this.session.user.id, event.target.files[0]).subscribe();
        }
    };


    /**
     * Выход из учетной записи пользователя, завершение сессии
     */
    logOut(): void {
        this.session.logOut().subscribe((result: any) => {
            console.log('logOut result', result);
            this.router.navigate(['/']);
        });
    };

}