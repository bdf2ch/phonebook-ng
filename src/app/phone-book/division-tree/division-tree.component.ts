import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { appConfig } from '../../app.config';
import { DivisionTreeService } from './division-tree.service';
import { Division } from '../../models/division.model';


@Component({
    selector: 'division-tree',
    templateUrl: './division-tree.component.html',
    styleUrls: ['./division-tree.component.css']
})
export class DivisionTreeComponent implements OnInit {
    @Input() id: string = '';
    @Input() divisions: Division[] = [];
    @Output() onSelect: EventEmitter<Division> = new EventEmitter();
    private root: Division[] = [];
    private selectedDivision: Division = null;


    constructor (private divisionTrees: DivisionTreeService) {};


    ngOnInit(): void {
        this.divisionTrees.register(this);
        this.divisions.forEach((division: Division) => {
            this.addDivision(division);
        });

        const root = this.getDivisionById(appConfig.defaultOrganizationId);
        console.log('root', root);
        if (root) {
            this.setRootDivision(root);
            //this.phoneBook.fetchContactsByDivisionId(division.id, appConfig.defaultSourceAtsId, this.session.session ? this.session.session.token : '').subscribe();
        }
    };


    addDivision(division: Division): void {
        const parentById = (item: Division, index: number, divisions: Division[]) => item.id === division.parentId;
        const parent = this.divisions.find(parentById);
        this.divisions.push(division);
        if (parent) {
            parent.children.push(division);
        } else {
            this.root.push(division);
        }
    };


    deleteDivision(division: Division): void {
        if (division.parentId !== 0) {
            const findDivisionById = (div: Division) => div.id === division.parentId;
            const parent = this.divisions.find(findDivisionById);
            if (parent) {
                console.log('parent', parent);
                parent.children.forEach((child: Division, index: number, children: Division[]) => {
                    if (child.id === division.id) {
                        children.splice(index, 1);
                    }
                });
            }
        }

        this.divisions.forEach((item: Division, index: number, divisions: Division[]) => {
            if (item.id === division.id) {
                divisions.splice(index, 1);
            }
        });

        this.root.forEach((item: Division, index: number, root: Division[]) => {
            if (item.id === division.id) {
                root.splice(index, 1);
            }
        });
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


    deselect(): void {
        this.divisions.forEach((division: Division) => {
            if (division.isSelected === true) {
                division.isSelected = false;
            }
        });
    };


    getDivisionById(divisionId: number): Division | null {
        let result: Division | null = null;
        this.divisions.forEach((division: Division, index: number, array: Division[]) => {
            if (division.id === divisionId) {
                console.log('found', division);
                result = division;
            }
        });
        return result;
    };


    setRootDivision(division: Division): void {
        this.root = division.children;
    };
};
