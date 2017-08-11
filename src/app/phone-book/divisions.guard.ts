import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { PhoneBookService } from './phone-book.service';


@Injectable()
export class DivisionsGuard implements CanActivate {

    constructor (private phoneBook: PhoneBookService) {};

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
        if (this.phoneBook.getDivisionList().length === 0) {
            return this.phoneBook.fetchInitialData().map(() => {
                return true;
            });
        } else {
            return true;
        }
    }
};
