import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { SessionService } from "../session.service";


@Injectable()
export class FavoriteContactsUserSessionGuard implements CanActivate {

    constructor (private router: Router,
                 private session: SessionService) {};

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
        if (this.session.user() !== null) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }

    }

};
