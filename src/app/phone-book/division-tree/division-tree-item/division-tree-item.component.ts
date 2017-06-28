import { Component, Input } from '@angular/core';
import { Division } from "../../../models/Division.model";
import {DivisionTreeComponent} from "../division-tree.component";


@Component({
    selector: 'division-tree-item',
    templateUrl: './division-tree-item.component.html',
    styleUrls: ['./division-tree-item.component.css']
})
export class DivisionTreeItemComponent {
    @Input() division: Division[] = [];
    @Input() tree: DivisionTreeComponent;
    @Input() level: number = 0;
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
