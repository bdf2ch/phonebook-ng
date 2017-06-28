import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { PhoneBookService } from './phone-book.service';


@Injectable()
export class CanActivatePhoneBookGuard implements CanActivate {

    constructor (private phoneBook: PhoneBookService) {};

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
        return this.phoneBook.fetchDivisionList().map(() => {
            return true;
        });
    }

};
