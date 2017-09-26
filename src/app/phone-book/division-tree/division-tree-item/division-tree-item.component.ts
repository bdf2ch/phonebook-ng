import {
    ChangeDetectionStrategy, Component, ElementRef, Input, Output, Renderer2, ViewEncapsulation, OnInit
} from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { Division } from "../../../models/Division.model";
import { DivisionTreeComponent } from "../division-tree.component";
import { PhoneBookService } from "../../phone-book.service";
import { Contact } from "../../../models/contact.model";


@Component({
    selector: 'division-tree-item',
    templateUrl: './division-tree-item.component.html',
    styleUrls: ['./division-tree-item.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger("slide", [
            state('true', style({
                transform: 'scaleY(1)'
            })),
            state('false', style({
                transform: 'scaleY(0)'
            })),
            transition('* => true', animate(100)),
            transition('true => *', animate(100)),
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
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
                private phoneBook: PhoneBookService) {

        this.renderer.listen(this.element.nativeElement, 'dragenter', (event: any) => {
            this.renderer.addClass(event.target, 'drag-over');
        });



        this.renderer.listen(this.element.nativeElement, 'dragover', (event: any) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        });


        this.renderer.listen(this.element.nativeElement, 'dragleave', (event: any) => {
            this.renderer.removeClass(event.target, 'drag-over');
        });


        this.renderer.listen(this.element.nativeElement, 'drop', (event: any) => {
            event.stopPropagation();
            console.log(event);
            console.log('drop conatctId = ', event.dataTransfer.getData('contactId'), ', division id = ', this.division.id);
            console.log('now dragging', this.phoneBook.nowDragging);
            if (this.phoneBook.nowDragging !== null) {
                this.phoneBook.setContactDivision(this.phoneBook.nowDragging.contact, this.division, this.phoneBook.nowDragging.group, this.phoneBook.selectedATS().id)
                    .subscribe((contact: Contact) => {
                        console.log(contact);
                    });
            }
        });


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
};
