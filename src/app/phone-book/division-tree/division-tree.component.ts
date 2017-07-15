import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { DivisionTreeService } from './division-tree.service';
import { Division } from '../../models/Division.model';


@Component({
    selector: 'division-tree',
    templateUrl: './division-tree.component.html',
    styleUrls: ['./division-tree.component.css']
})
export class DivisionTreeComponent implements OnInit{
    @Input() id: string = '';
    @Input() divisions: Division[] = [];
    @Output() onSelect: EventEmitter<Division> = new EventEmitter();
    private root: Division[] = [];
    private selectedDivision: Division = null;


    constructor (private divisionTrees: DivisionTreeService) {};


    ngOnInit(): void {
        this.divisionTrees.register(this);
        this.divisions.forEach((division) => {
            this.addDivision(division);
        });
    };

    addDivision(division: Division): void {
        if (division) {
            const parentById = (item: Division, index: number, divisions: Division[]) => item.id === division.parentId;
            const parent = this.divisions.find(parentById);
            if (parent !== undefined) {
                parent.children.push(division);
            } else {
                this.root.push(division);
            }
        }
    };


    selectDivision(division: Division): void {
        if (division) {
            const divisionById = (item: Division, index: number, divisions: Division[]) => item.id === division.id;
            const div = this.divisions.find(divisionById);
            if (!div.isSelected) {
                this.divisions.forEach((item) => {
                   item.isSelected = item.id === division.id ? true : false;
                });
                div.isSelected = true;
                div.isOpened = true;
                this.onSelect.emit(division);
            } else {
                div.isSelected = false;
                div.isOpened = false;
                this.onSelect.emit(null);
            }
        }
    };
};
