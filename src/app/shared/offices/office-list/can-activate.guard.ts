import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { SessionService } from "../../session/session.service";


@Injectable()
export class OfficeListCanActivateGuard implements CanActivate {

    constructor (private router: Router,
                 private session: SessionService) {};

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
        if (this.session.user && this.session.user.isAdministrator) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    };
}
