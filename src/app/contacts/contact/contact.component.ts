import {
    Component, Input, Host, ElementRef, OnInit, OnChanges, SimpleChanges, Renderer2, HostListener,
    ViewEncapsulation, Output, EventEmitter, ChangeDetectionStrategy, NgZone
} from '@angular/core';
import { Contact } from "../../models/contact.model";
import { PhoneBookService } from "../../shared/phone-book/phone-book.service";
import { ContactGroupComponent } from "../contact-group/contact-group.component";
import {SessionService} from "../../shared/session/session.service";
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
    private isPhotoUploading: boolean;

    constructor(private zone: NgZone,
                private phoneBook: PhoneBookService,
                public element: ElementRef,
                private renderer: Renderer2,
                private session: SessionService,
                private modals: ModalsService) {
        this.isPhotoUploading = false;

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


        this.zone.runOutsideAngular(() => {
            this.element.nativeElement.addEventListener('dragstart', (event: any) => {
                console.log('contact drag started');
            });

            this.element.nativeElement.addEventListener('dragenter', (event: any) => {
                console.log('dragenter contact');
                this.renderer.addClass(event.target, 'drag-over');
                //this.element.nativeElement.classList.add('drag-over');
            });

            this.element.nativeElement.addEventListener('dragover', (event: any) => {
                console.log('dragover contact');
                event.preventDefault();
                //this.renderer.removeClass(event.target, 'drag-over');
            });

            this.element.nativeElement.addEventListener('dragleave', (event: any) => {
                console.log('dragleave contact');
                //this.element.nativeElement.classList.removeCookie('drag-over');
                this.renderer.removeClass(event.target, 'drag-over');
            });

            this.element.nativeElement.addEventListener('drop', (event: any) => {
                event.stopPropagation();
                console.log(event);
                //console.log('drop conatctId = ', event.dataTransfer.getData('contactId'), ', division id = ', this.division.id);
                //console.log('now dragging', this.phoneBook.nowDragging);
                let order = this.contact.order;
                //this.contact.order = order - 1;
                this.phoneBook.nowDragging.contact.order = order - 1;
                console.log('new order = ', order);
                console.log('placed order = ', this.phoneBook.nowDragging.contact.order);
                this.phoneBook.nowDragging.group.contacts.forEach((contact: Contact, index: number, group: Contact[]) => {
                    if (contact.id === event.dataTransfer.getData(parseInt('contactId'))) {
                        group[index] = this.contact;
                        this.contact = contact;
                    }
                });
            });
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
                this.phoneBook.addContactToFavorites(
                    this.contact.id, this.phoneBook.selectedAts.id,this.session.session ? this.session.session.token : '').subscribe((res: any) => {
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
        this.isPhotoUploading = true;
        this.phoneBook.uploadContactPhoto(this.contact.id, event.target.files[0])
            .subscribe((url: string) => {
                console.log('new photo url = ', url);
                this.contact.photo = url;
                console.log(this.contact);
                if (this.session.user) {
                    if (this.session.user.id === this.contact.userId) {
                        this.session.user.photo = url;
                    }

                }
                // Если контакт находится в избранных - меняем фото
                if (this.phoneBook.favorites.contacts.length > 0) {
                    this.phoneBook.favorites.contacts.forEach((contact: Contact, index: number, array: Contact[]) => {
                        if (contact.id === this.contact.id) {
                            contact.photo = url;
                        }
                    });
                }
                this.isPhotoUploading = false;
            });
    };

    editContactPhoto(): void {
        this.onEditContactPhoto.emit();
        this.phoneBook.selectedContact = this.contact;
        this.modals.get('edit-contact-photo-modal').open();
    };



    deleteContact(contact: Contact): void {
        this.phoneBook.selectedContact = contact;
        this.modals.get('delete-contact-modal').open();
    };


    showContactInfo(): void {
        this.phoneBook.selectedContact = this.contact;
        this.modals.get('contact-info-modal').open();
    };
};
