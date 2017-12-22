import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { appConfig } from '../../app.config';
import { Division } from '../../models/division.model';
import { PhoneBookService } from '../phone-book.service';
import { DivisionTreeService } from '../division-tree/division-tree.service';
import { SessionService } from '../session.service';


@Component({
    selector: 'company-selector',
    templateUrl: './company-selector.component.html',
    styleUrls: ['./company-selector.component.css']
})
export class CompanySelectorComponent implements OnChanges {
    @Input() divisions: Division[] = [];
    @Output() onSelectOrganization: EventEmitter<Division> = new EventEmitter();
    private opened: boolean = false;
    private selected: Division | null = null;


    constructor(private session: SessionService,
                private phoneBook: PhoneBookService,
                private divisionTrees: DivisionTreeService) {}


    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes['divisions']['firstChange']) {
            console.info('divisions first change');
            changes['divisions']['currentValue'].forEach((item: Division, index: number, array: Division[]) => {
                if (item.id === appConfig.defaultOrganizationId) {
                    this.selected = item;
                    this.phoneBook.selectedOrganization = item;
                }
            });
        }
    };


    open(): void {
        this.opened = !this.opened;
    };


    select(division: Division): void {
        console.log('org', division);
        this.selected = division;
        this.phoneBook.selectedOrganization = division;
        const tree = this.divisionTrees.getById('phone-book-divisions');
        console.log('tree', tree);
        const root = tree.getDivisionById(division.id);
        console.log('root', root);
        if (root) {
            tree.setRootDivision(root);
            this.phoneBook.fetchContactsByDivisionId(division.id, appConfig.defaultSourceAtsId, this.session.session ? this.session.session.token : '').subscribe();
        }
        this.open();
        this.onSelectOrganization.emit(division);
    };
}
