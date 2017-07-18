import {Component, Input, ViewEncapsulation } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { Division } from "../../../models/Division.model";
import { DivisionTreeComponent } from "../division-tree.component";


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
    ]
})
export class DivisionTreeItemComponent {
    @Input() division: Division[] = [];
    @Input() tree: DivisionTreeComponent;
    @Input() level: number = 0;
    @Input() last: boolean = false;
    //@Input() parent: DivisionTreeItemComponent;
    private isOpened: boolean = false;
    private isSelected: boolean = false;


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
