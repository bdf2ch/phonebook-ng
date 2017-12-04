import {
    AfterViewChecked,
    Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output,
    SimpleChanges
} from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import {PhoneBookService} from "../phone-book.service";
import { PhoneBookManagerService } from '../../manager/phone-book-manager.service';
import {SessionService} from "../session.service";
import {Contact} from '../../models/contact.model';
import {Phone} from "../../models/phone.model";


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
    @Input() contact: any;
    @Input() isOpened: boolean;
    @Output() onClose: EventEmitter<any> = new EventEmitter();
    private opened: boolean = false;
    private isInAddPhoneMode: boolean = false;
    private newPhone: Phone;


    constructor(private element: ElementRef,
                private phoneBook: PhoneBookService,
                private phoneBookManager: PhoneBookManagerService,
                private session: SessionService) {
        this.newPhone = new Phone();
    };


    ngOnChanges (changes: SimpleChanges) {
        if (changes['isOpened']) {
            this.opened = changes['isOpened']['currentValue'];
        }
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
     * Установка / получение состояния режима добавления нового телефона
     * @param flag {boolean?} - состояние режима
     * @returns {boolean}
     */
    addPhoneMode(flag?: boolean): boolean {
        if (flag !== undefined) {
            this.isInAddPhoneMode = flag;
            this.newPhone.restoreBackup();
        }
        return this.isInAddPhoneMode;
    };


    addPhone(ats: any): void {
        console.log(ats);
        console.log(this.newPhone);

        this.phoneBookManager.addContactPhone(this.contact.id, this.newPhone.atsId, this.newPhone.number)
            .subscribe((phone: Phone) => {
                this.contact.phones.push(phone);
                this.addPhoneMode(false);
            });
    };



    editPhone(phone: Phone, form: any) : void {
        this.phoneBookManager.editContactPhone(phone)
            .subscribe((phone: Phone) => {
                form.reset({
                    ats: phone.atsId,
                    phone: phone.number
                })
            });
    };


    deletePhone(phone: Phone): void {
        this.phoneBookManager.deleteContactPhone(phone)
            .subscribe((result: boolean) => {
                if (result === true) {
                    this.contact.phones.forEach((item: Phone, index: number, array: Phone[]) => {
                        if (item.id === phone.id) {
                            array.splice(index, 1);
                        }
                    });
                }
            });
    };


    edit(): void {
        this.phoneBookManager.editContact(this.contact)
            .subscribe((contact: Contact) => {
                this.close(false);
            });
    };


    /**
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any) {
        return item.id; // or item.id
    }


    /**
     * Закрывает окно редактирования контакта
     */
    close(restore: boolean): void {
        this.opened = false;
        this.addPhoneMode(false);
        if (restore) {
            this.contact.restoreBackup();
            this.newPhone.restoreBackup();
            this.contact.phones.forEach((phone: Phone) => {
                console.log(phone);
                phone.restoreBackup(['atsId', 'number']);
            });
        } else {
            this.contact.setupBackup(['surname', 'name', 'fname', 'position', 'email', 'mobile']);
        }
        this.onClose.emit();
    };
};