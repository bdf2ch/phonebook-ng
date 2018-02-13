import {
    ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, ViewEncapsulation, OnInit, NgZone,
} from '@angular/core';
import { Division } from "../../../models/division.model";
import { DivisionTreeComponent } from "../division-tree.component";
import { PhoneBookService } from "../../phone-book.service";
import { PhoneBookManagerService } from '../../../manager/phone-book-manager.service';
import { Contact } from "../../../models/contact.model";


@Component({
    selector: 'division-tree-item',
    templateUrl: './division-tree-item.component.html',
    styleUrls: ['./division-tree-item.component.css'],
    encapsulation: ViewEncapsulation.None,
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class DivisionTreeItemComponent implements OnInit {

    ngOnInit(): void {};

    @Input() division: Division;
    @Input() tree: DivisionTreeComponent;
    @Input() level: number = 0;
    @Input() last: boolean = false;
    private isOpened: boolean = false;
    private isSelected: boolean = false;


    constructor(private element: ElementRef,
                private renderer: Renderer2,
                private phoneBook: PhoneBookService,
                private phoneBookManager: PhoneBookManagerService,
                private zones: NgZone) {


        this.zones.runOutsideAngular(() => {
            this.element.nativeElement.addEventListener('dragenter', (event: any) => {
                //console.log('dragenter');
                this.renderer.addClass(event.target, 'drag-over');
                //this.element.nativeElement.classList.add('drag-over');
            });

            this.element.nativeElement.addEventListener('dragover', (event: any) => {
                //console.log('dragover');
                event.preventDefault();
                //this.renderer.removeClass(event.target, 'drag-over');
            });

            this.element.nativeElement.addEventListener('dragleave', (event: any) => {
                //console.log('dragleave');
                //this.element.nativeElement.classList.removeCookie('drag-over');
                this.renderer.removeClass(event.target, 'drag-over');
            });

            this.element.nativeElement.addEventListener('drop', (event: any) => {
                event.stopPropagation();
                console.log(event);
                console.log('drop conatctId = ', event.dataTransfer.getData('contactId'), ', division id = ', this.division.id);
                console.log('now dragging', this.phoneBook.nowDragging);
                if (this.phoneBook.nowDragging !== null) {
                    this.phoneBookManager.setContactDivision(this.phoneBook.nowDragging.contact, this.division, this.phoneBook.nowDragging.group, this.phoneBook.selectedAts.id)
                        .subscribe((contact: Contact) => {
                            console.log(contact);
                            this.renderer.removeClass(event.target, 'drag-over');
                        });
                }
            });
        });



        //this.renderer.listen(this.element.nativeElement, 'dragenter', (event: any) => {
        //    this.renderer.addClass(event.target, 'drag-over');
        //});



        //this.renderer.listen(this.element.nativeElement, 'dragover', (event: any) => {
        //    event.preventDefault();
        //    event.dataTransfer.dropEffect = 'move';
        //});


        //this.renderer.listen(this.element.nativeElement, 'dragleave', (event: any) => {
        //    this.renderer.removeClass(event.target, 'drag-over');
        //});


        /*
        this.renderer.listen(this.element.nativeElement, 'drop', (event: any) => {
            event.stopPropagation();
            console.log(event);
            console.log('drop conatctId = ', event.dataTransfer.getData('contactId'), ', division id = ', this.division.id);
            console.log('now dragging', this.phoneBook.nowDragging);
            if (this.phoneBook.nowDragging !== null) {
                this.phoneBookManager.setContactDivision(this.phoneBook.nowDragging.contact, this.division, this.phoneBook.nowDragging.group, this.phoneBook.selectedAts.id)
                    .subscribe((contact: Contact) => {
                        console.log(contact);
                    });
            }
        });
        */


    };


    expand(): void {
        this.isOpened = true;
    };


    collapse(): void {
        this.isOpened = false;
    };


    select(): void {
        if (this.isSelected) {
            this.collapse();
        } else {
            this.expand();
        }
        this.isSelected = !this.isSelected;
    };
}
