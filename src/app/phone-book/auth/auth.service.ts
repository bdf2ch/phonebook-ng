import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { User } from "../../models/user.model";
import {ISessionData} from "../../models/session.model";


@Injectable()
export class AuthService {
    private apiUrl: string = 'http://127.0.0.1:4444/api';
    private loading: boolean = false;

    /**
     * Конструктор
     * @param http {Http}
     */
    constructor (private http: Http) {};


    logIn(account: string, password: string): Observable<User|null> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = {
            action: 'login',
            data: {
                account: account,
                password: password
            }
        };

        return this.http.post(this.apiUrl, parameters, options)
            .map((res: Response) => {
                let body = res.json();
                if (body !== null) {

                    let user = new User(body);
                    console.log('ldap user = ', user);
                    return user;
                } else
                    return null;
            })
            .take(1)
            .catch(this.handleError);
    };


    /**
     * Обработчик ошибок при обращении к серверу
     * @param error {Response|any}
     * @returns {any}
     */
    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        this.loading = false;
        console.error(errMsg);
        return Observable.throw(errMsg);
    };
};
