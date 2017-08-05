import {Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { AuthService } from "./auth.service";
import { SessionService } from "../../utilities/session/session.service";
import { CookieService } from "../../utilities/cookies/cookie.services";
import { isError } from "../../models/error.model";



@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
    animations: [
        trigger("fog", [
            state('true', style({
                background: 'rgba(0, 0, 0, 0.5)'
            })),
            transition('void => *', animate("200ms linear")),
            transition('* => void', animate("200ms linear")),
        ]),
        trigger("popup", [
            state('true', style({
                transform: 'scale(1.0)'
            })),
            state('false', style({
                transform: 'scale(0.1)'
            })),
            transition('void => true', animate('100ms ease-in')),
            transition('* => void', animate('100ms linear')),
        ])
    ]
})
export class AuthComponent implements OnChanges {
    @Input() isOpened: boolean;
    @Output() onClose: EventEmitter<any> = new EventEmitter();
    private opened: boolean = false;
    private account: string = '';
    private password: string = '';

    constructor (private element: ElementRef,
                 private session: SessionService,
                 private cookies: CookieService) {};


    ngOnChanges (changes: SimpleChanges) {
        this.opened = changes['isOpened']['currentValue'];
    };

    ngAfterViewChecked () {
        if (this.opened) {
            let element = this.element.nativeElement.children[1];
            element.style.top = window.innerHeight / 2 - element.clientHeight / 2 + 'px';
            element.style.left = window.innerWidth / 2 - element.clientWidth / 2 + 'px';
        }
    };

    @HostListener('window:resize', ['$event']) onWindowResize (event: any) {
        if (this.opened) {
            let element = this.element.nativeElement.children[1];
            element.style.left = event.target.innerWidth / 2 - element.clientWidth / 2 + 'px';
            element.style.top = event.target.innerHeight / 2 - element.clientHeight / 2 + 'px';
        }
    };


    send(): void {
        this.session.logIn(this.account, this.password).subscribe((result: any) => {
            if (!isError(result)) {
                console.log('result', result);
                this.cookies.set({
                    name: 'kolenergo',
                    value: result.session.token
                });
                this.close();
            }
        });
    };


    /**
     * Закрывает окно аутентификации пользователя
     */
    close(): void {
        this.opened = false;
        this.account = '';
        this.password = '';
        this.onClose.emit();
    };
};