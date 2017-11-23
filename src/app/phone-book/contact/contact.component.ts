import {
    Component, Input, Host, ElementRef, OnInit, OnChanges, SimpleChanges, Renderer2, HostListener,
    ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import { Contact } from "../../models/contact.model";
import { PhoneBookService } from "../phone-book.service";
import { ContactGroupComponent } from "../contact-group/contact-group.component";
import {SessionService} from "../session.service";
import { ContactGroup } from '../../models/contact-group.model';
import { ModalsService } from '@bdf2ch/angular-transistor';


@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    encapsulation: ViewEncapsulation.None
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements  OnInit, OnChanges{
    @Input() private contact: Contact;
    @Input() private group: ContactGroup;
    @Input() index: number;
    @Input() marginRight: number;
    @Input() row: number;
    @Output() onChangeDivision: EventEmitter<number> = new EventEmitter();
    @Output() onEditContactClick: EventEmitter<Contact> = new EventEmitter();
    @Output() onEditContactPhoto: EventEmitter<any> = new EventEmitter();

    constructor(private phoneBook: PhoneBookService,
                public element: ElementRef,
                private renderer: Renderer2,
                private session: SessionService,
                private modals: ModalsService) {

        this.renderer.listen(this.element.nativeElement, 'dragstart', (event: any) => {
            console.log('drag started');
            event.cancelBubble = true;
            event.stopPropagation();
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('contactId', this.contact.id.toString());
            console.log('data', event.dataTransfer.getData('contactId'));
            this.phoneBook.nowDragging = {
                contact: this.contact,
                group: this.group
            };
            console.log('group', this.phoneBook.nowDragging);
        });

        this.renderer.listen(this.element.nativeElement, 'dragend', (event: any) => {
            console.log('drag ended');
            event.cancelBubble = true;
            event.stopPropagation();
            //this.phoneBook.nowDragging = null;
        });

    };



    ngOnInit(): void {
        //console.log('contact', this.element.nativeElement.children[0]);
        //console.log('host', this.host.element.clientWidth);
        if (this.session.user && this.session.user.isAdministrator) {
            this.renderer.setAttribute(this.element.nativeElement.children[0], 'draggable', 'true');
        }
    };

    ngOnChanges(changes: SimpleChanges): void {
        //console.log(changes['marginRight']['currentValue']);
        //console.log(changes['row']['currentValue']);
        this.renderer.setStyle(this.element.nativeElement.children[0], 'margin-right', this.marginRight + 'px');


        if (changes['row'] !== undefined) {
            switch (changes['row']['currentValue']) {
                case 2:
                    this.clearClasses();
                    this.renderer.addClass(this.element.nativeElement.children[0], 'two-in-row');
                    break;
                case 3:
                    this.clearClasses();
                    this.renderer.addClass(this.element.nativeElement.children[0], 'three-in-row');
                    break;
                case 4:
                    this.clearClasses();
                    this.renderer.addClass(this.element.nativeElement.children[0], 'four-in-row');
                    break;
                case 5:
                    this.clearClasses();
                    this.renderer.addClass(this.element.nativeElement.children[0], 'five-in-row');
                    break;
                case 6:
                    this.clearClasses();
                    this.renderer.addClass(this.element.nativeElement.children[0], 'six-in-row');
                    break;
                default:
                    this.clearClasses();
                    break;
            }
        }
    };


    clearClasses(): void {
        this.renderer.removeClass(this.element.nativeElement.children[0], 'two-in-row');
        this.renderer.removeClass(this.element.nativeElement.children[0], 'three-in-row');
        this.renderer.removeClass(this.element.nativeElement.children[0], 'four-in-row');
        this.renderer.removeClass(this.element.nativeElement.children[0], 'five-in-row');
        this.renderer.removeClass(this.element.nativeElement.children[0], 'six-in-row');
    };


    favorites(): void {
        if (!this.phoneBook.loading) {
            if (!this.contact.isInFavorites) {
                this.phoneBook.addContactToFavorites(this.contact.id, this.session.session ? this.session.session.token : '').subscribe((res: any) => {
                    this.contact.isInFavorites = true;
                });
            } else {
                this.phoneBook.removeContactFromFavorites(this.contact.id, this.session.session ? this.session.session.token : '').subscribe(() => {
                    this.contact.isInFavorites = false;
                });
            }
        }
    };


    editContact(): void {
        //this.onEditContactClick.emit(this.contact);
        this.phoneBook.selectedContact = this.contact;
        this.modals.get('edit-contact-modal').open();
    };


    uploadPhoto(event: any): void {
        this.phoneBook.uploadUserPhoto(this.contact.userId, event.target.files[0])
            .subscribe((url: string) => {
                console.log('new photo url = ', url);
                this.contact.photo = url;
                console.log(this.contact);
            });
    };

    editContactPhoto(): void {
        this.onEditContactPhoto.emit();
        this.phoneBook.selectedContact = this.contact;
        this.modals.get('edit-contact-photo-modal').open();
    };
};
