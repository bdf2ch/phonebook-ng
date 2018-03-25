import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { PhoneBookService } from '../phone-book/phone-book.service';
import { CookieService } from "../cookies/cookie.services";
import { SessionService } from "./session.service";


@Injectable()
export class UserSessionGuard implements CanActivate {

    constructor (private router: Router,
                 private phoneBook: PhoneBookService,
                 private cookies: CookieService,
                 private session: SessionService) {};

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
        let cookie = this.cookies.getByName('kolenergo');
        if (cookie) {
            console.log('user session guard');
            return this.session.fetchSessionData(cookie.value).map((res: any) => {
                console.log('session', res);
                return true;
            });
        } else {
            if (!this.phoneBook.isInitialDataRecieved) {
                return this.phoneBook.fetchInitialData().map((res: any) => {
                    return true;
                });
            } else {
                return true;
            }
        }
    }

};
