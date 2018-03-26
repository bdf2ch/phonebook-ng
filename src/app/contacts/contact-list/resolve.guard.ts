import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SessionService } from "../../shared/session/session.service";
import { ContactsService } from "../contacts.service";
import { DivisionsService } from "../../shared/divisions/divisions.service";
import { Observable } from 'rxjs/Observable';
import { ContactGroup } from "../../models/contact-group.model";
import { appConfig } from "../../app.config";



@Injectable()
export class ContactListResolveGuard implements Resolve<ContactGroup[]> {
    constructor(private contacts: ContactsService,
                private router: Router,
                private session: SessionService,
                private divisions: DivisionsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ContactGroup[]> {
        let divisionId = +route.paramMap.get('divisionId');
        console.log('divisionId param = ', divisionId);
        let division = this.divisions.getById(divisionId);
        if (division) {
            if (division.isOrganization) {
                return this.contacts.getByDivisionId(divisionId, appConfig.defaultSourceAtsId, this.session.session ? this.session.session.token : '');
            } else {
                return this.contacts.getByDivisionIdRecursive(divisionId, appConfig.defaultSourceAtsId, this.session.session ? this.session.session.token : '');
            }
        }



        /*
        return this.cs.getCrisis(id).take(1).map(crisis => {
            if (crisis) {
                return crisis;
            } else { // id not found
                this.router.navigate(['/crisis-center']);
                return null;
            }
        });
        */
    }
}