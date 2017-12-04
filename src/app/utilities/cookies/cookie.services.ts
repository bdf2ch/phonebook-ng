import { Injectable } from '@angular/core';
import { Cookie, ICookie } from "./cookie.model";


@Injectable()
export class CookieService {
    cookies: Cookie[] = [];

    constructor() {
        let raw = document.cookie.split('; ');
        raw.forEach((rawCookie: string, index: number, array: string[]) => {
            let cookie = new Cookie(rawCookie.trim());
            this.cookies.push(cookie);
        });
        console.log('cookies', this.cookies);
    };


    getByName(name: string): Cookie | null {
        const findCookieByName = (cookie: Cookie, index: number, array: Cookie[]) => cookie.name === name;
        const cookieIsFound = this.cookies.find(findCookieByName);
        return cookieIsFound ? cookieIsFound : null;
    };



    set(config: ICookie): Cookie {
        let cookie = new Cookie(config);
        document.cookie = cookie.save();
        return cookie;
    };


    remove(name: string): boolean {
        const cookie = this.getByName(name);
        if (cookie) {
            let date = new Date;
            cookie.expires = new Date(date.setDate(date.getDate() - 100));
            document.cookie = cookie.serialize();
            return true;
        }
        return false;
    };

};