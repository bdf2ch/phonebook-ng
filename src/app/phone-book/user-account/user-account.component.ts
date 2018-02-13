import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { SessionService } from '../session.service';
import { PhoneBookService } from '../phone-book.service';
import { ModalsService } from "@bdf2ch/angular-transistor";
import { FeedbackMessage } from "../../models/feedback-message.model";
import {FeedbackMessageTheme} from "../../models/feedback-message-theme.model";


@Component({
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {

    /**
     * Конструктор
     * @param {Router} router
     * @param {SessionService} session
     * @param {PhoneBookService} phoneBook
     * @param {ModalsService} modals
     */
    constructor(private router: Router,
                private session: SessionService,
                private phoneBook: PhoneBookService,
                private modals: ModalsService) {
        this.phoneBook.isInUserAccountMode = true;
        this.phoneBook.isInFavoritesMode = false;
        this.phoneBook.allowToAddContacts = false;
    };


    uploadPhoto(event: any): void {
        if (this.session.user) {
            console.log('userId', this.session.user.id);
            console.log('file', event.target.files[0]);
            this.phoneBook.uploadContactPhotoForModeration(this.session.user.id, event.target.files[0]).subscribe((result: boolean) => {
                if (result === true) {
                    this.modals.get('photo-upload-success-modal').open();
                }
            });
        }

    };

    test(): void {
        this.modals.get('photo-upload-success-modal').open();
    };


    /**
     * Закрывает модальное окно с уведомлением об успешной загрузке фотографии абонента
     */
    closeUploadPhotoSuccessModal(): void {
        this.modals.get('photo-upload-success-modal').close();
    };


    /**
     * Выход из учетной записи пользователя, завершение сессии
     */
    logOut(): void {
        this.session.logOut().subscribe((result: any) => {
            console.log('end result', result);
            this.router.navigate(['/']);
        });
    };


    private feedback = {
        /**
         * Сообщение обратной связи
         */
        message: new FeedbackMessage(),

        /**
         * Массив с темами сообщения обратной связи
         */
        themes: [
            new FeedbackMessageTheme(1, 'Ошибка в работе справочника'),
            new FeedbackMessageTheme(2, 'Несоответствие данных в справочнике'),
            new FeedbackMessageTheme(3, 'Замечания и предложения')
        ],

        /**
         * Открывает модальное окно обратной связи
         */
        open: () => {
            this.modals.get('feedback-modal').open();
        },

        /**
         * Закрывает окно обратной связи и очищает форму
         * @param {NgForm} form - Форма обратной связи
         */
        close: (form: NgForm) => {
            this.modals.get('feedback-modal').close();
            form.reset({
                'theme': 2,
                'message': ''
            });
        },

        /**
         * Отправляет сообщегние обратной связи и очищает форму
         * @param {NgForm} form - Форма обратной связи
         */
        send: (form: NgForm) => {
            console.log(this.feedback.message);
            this.phoneBook.sendFeedbackMessage(this.session.user.id, this.feedback.message).subscribe((result: boolean) => {
                if (result === true) {
                    window.setTimeout(() => {
                        this.modals.get('feedback-modal').close();
                        form.reset({'theme': 2, 'message': ''});
                    }, 1000);

                }
            });
        }
    };
}