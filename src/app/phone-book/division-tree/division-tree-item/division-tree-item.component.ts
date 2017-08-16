import {
    ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2, ViewEncapsulation, OnInit,
    HostListener
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
    @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
        //console.log('host listener drag enter');
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
        this.renderer.addClass(event.target, 'drag-over');
    };


    //@HostListener('dragover', ['$event']) onDragOver(event: any) {
    //    console.log('host listener drag over');
    //    event.stopPropagation();
    //};


    @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
        //console.log('host listener drag leave');
        event.stopPropagation();
        this.renderer.removeClass(event.target, 'drag-over');
    };


    @HostListener('drop', ['$event']) onDrop(event: any) {
        console.log('host listener DROP');
        event.stopPropagation();
        console.log('drop conatctId = ', event.dataTransfer.getData('contactId'), ', division id = ', this.division.id);
        this.phoneBook.setContactDivision(parseInt(event.dataTransfer.getData('contactId')), this.division.id)
            .subscribe((contact: Contact) => {
                console.log(contact);
            });
    };




    ngOnInit(): void {
        /*
        this.renderer.listen(this.element.nativeElement, 'dragenter', (event: any) => {
            console.log('drag enter');
            this.renderer.addClass(event.target, 'drag-over');
        });
        */


        /*
        this.renderer.listen(this.element.nativeElement, 'dragover', (event: any) => {
            event.preventDefault();
            //if (!this.isDraggedOver) {
            //    this.renderer.addClass(this.element.nativeElement.children[0].children[0], 'drag-over');
            //}
        });
        */

        /*
        this.renderer.listen(this.element.nativeElement, 'dragleave', (event: any) => {
            //console.log('leave');
            event.cancelBubble = true;
            event.stopPropagation();

            console.log('drag leave');
            this.renderer.removeClass(event.target, 'drag-over');
        });
        */
    }

    @Input() division: Division;
    @Input() tree: DivisionTreeComponent;
    @Input() level: number = 0;
    @Input() last: boolean = false;
    //@Input() parent: DivisionTreeItemComponent;
    private isOpened: boolean = false;
    private isSelected: boolean = false;


    constructor(private element: ElementRef,
                private renderer: Renderer2,
                private phoneBook: PhoneBookService) {
        /*
        this.renderer.listen(this.element.nativeElement, 'dragenter', (event: any) => {
            console.log('drag enter');
            this.renderer.addClass(event.target, 'drag-over');
        });


        this.renderer.listen(this.element.nativeElement, 'dragover', (event: any) => {
            event.preventDefault();
            //if (!this.isDraggedOver) {
            //    this.renderer.addClass(this.element.nativeElement.children[0].children[0], 'drag-over');
            //}
        });

        this.renderer.listen(this.element.nativeElement, 'dragleave', (event: any) => {
            //console.log('leave');
            //event.cancelBubble = true;
            //event.stopPropagation();

            console.log('drag leave');
            this.renderer.removeClass(event.target, 'drag-over');
        });


        this.renderer.listen(this.element.nativeElement, 'drop', (event: any) => {
            event.stopPropagation();
            console.log('drop conatctId = ', event.dataTransfer.getData('contactId'), ', division id = ', this.division.id);
            this.phoneBook.setContactDivision(parseInt(event.dataTransfer.getData('contactId')), this.division.id)
                .subscribe((contact: Contact) => {
                    console.log(contact);
                });
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
};
