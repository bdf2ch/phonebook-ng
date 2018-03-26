import { Component, Input, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { appConfig } from '../../../app.config';
import { Division } from '../../../models/division.model';
import { PhoneBookService } from '../../phone-book/phone-book.service';
import { DivisionTreeService } from '../../divisions/division-tree/division-tree.service';
import { SessionService } from '../../session/session.service';
import { DivisionsService } from "../../divisions/divisions.service";
import { OrganizationsService } from "../organizations.service";


@Component({
    selector: 'company-selector',
    templateUrl: './organization-selector.component.html',
    styleUrls: ['./organization-selector.component.css']
})
export class CompanySelectorComponent {
    @Input() divisions: Division[] = [];
    //@Output() onSelectOrganization: EventEmitter<Division> = new EventEmitter();
    private opened: boolean = false;
    private selected: Division | null = null;


    constructor(private router: Router,
                private element: ElementRef,
                private renderer: Renderer2,
                private session: SessionService,
                private phoneBook: PhoneBookService,
                private divisionTrees: DivisionTreeService,
                private divisions_: DivisionsService,
                private organizations: OrganizationsService) {}


                /*
    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes['divisions']['firstChange']) {
            console.info('divisions first change');
            changes['divisions']['currentValue'].forEach((item: Division) => {
                //if (item.id === appConfig.defaultOrganizationId) {
                    //this.selected = item;
                    //this.phoneBook.selectedOrganization = item;
                //}
            });
        }
    };
    */


    open(): void {
        this.opened = !this.opened;
        if (this.element.nativeElement.children[0].children[1]) {
            //console.log('options height', this.element.nativeElement.children[0].children[1].clientHeight);
            let height: number = 0;
            for (let i: number = 0; i <  this.element.nativeElement.children[0].children[1].children.length; i++) {
                //console.log('option height', this.element.nativeElement.children[0].children[1].children[i].clientHeight);
                height += this.element.nativeElement.children[0].children[1].children[i].clientHeight;
            }

            this.renderer.setStyle(
                this.element.nativeElement.children[0].children[1],
                'height',
                height - 20 + 'px'
            );
        }
    };


    select(division: Division): void {
        console.log('org', division);
        this.selected = division;
        //this.phoneBook.selectedOrganization = division;
        this.organizations.selected(division);
        this.divisions_.selected(null);
        this.divisions_.new().parentId = division.id;

        const tree = this.divisionTrees.getById('phone-book-divisions');
        //console.log('tree', tree);
        const root = tree.getDivisionById(division.id);
        console.log('root', root);
        if (root) {
            tree.setRootDivision(root);
            this.router.navigate(['/division', division.id]);
            /*
            this.phoneBook.fetchContactsByDivisionId(
                division.id,
                appConfig.defaultSourceAtsId,
                this.session.session ? this.session.session.token : ''
            ).subscribe();
            */
        }
        this.open();
        //this.onSelectOrganization.emit(division);
    };
}
