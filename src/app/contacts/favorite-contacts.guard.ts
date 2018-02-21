import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { SessionService } from "../phone-book/session.service";


@Injectable()
export class FavoriteContactsGuard implements CanActivate {

    constructor (private router: Router,
                 private session: SessionService) {};

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
        if (!this.session.user) {
            this.router.navigate(['/']).then(() => {
                return true;
            });
        } else {
            return true;
        }
    }

}
