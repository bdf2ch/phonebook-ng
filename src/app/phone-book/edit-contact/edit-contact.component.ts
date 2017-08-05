import {
    AfterViewChecked,
    Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output,
    SimpleChanges
} from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Contact } from '../../models/contact.model';
import {PhoneBookService} from "../phone-book.service";
import {SessionService} from "../../utilities/session/session.service";


@Component({
    selector: 'edit-contact',
    templateUrl: './edit-contact.component.html',
    styleUrls: ['./edit-contact.component.css'],
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
export class EditContactComponent implements OnChanges, AfterViewChecked {
    @Input() contact: Contact;
    @Input() isOpened: boolean;
    @Output() onClose: EventEmitter<any> = new EventEmitter();
    private opened: boolean = false;

    constructor(private element: ElementRef,
                private phoneBook: PhoneBookService,
                private session: SessionService) {
        console.log('edit contact component');
    };


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


    /**
     * Закрывает окно редактирования контакта
     */
    close(): void {
        this.opened = false;
        this.onClose.emit();
    };
};