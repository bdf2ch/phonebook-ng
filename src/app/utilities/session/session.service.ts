///<reference path="../../models/contact-group.model.ts"/>
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ISessionData, Session } from "../../models/session.model";
import { User } from "../../models/user.model";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { isError, RuntimeError } from "../../models/error.model";
import { IContact, Contact } from "../../models/contact.model";
import { ContactGroup } from "../../models/contact-group.model";
import {IPermission, Permission} from "../../models/permission.model";


@Injectable()
export class SessionService {
    private currentSession: Session|null = null;
    private currentUser: User|null = null;
    private phoneBookAdmin: boolean = false;
    private loading: boolean = false;


    /**
     * Конструктор
     * @param http {Http}
     */
    constructor (private http: Http,
                 private router: Router) {};


    fetchSessionData(token: string): Observable<ISessionData> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = { action: 'getSession', data: { token: token }};

        this.loading = true;
        return this.http.post('http://127.0.0.1:4444/api', parameters, options)
            .map((response: Response) => {
                this.loading = false;
                let body = response.json();
                this.currentSession = body.session ? new Session(body.session) : null;
                this.currentUser = body.user ? new User(body.user) : null;

                if (body.permissions) {
                    body.permissions.forEach((item: IPermission, index: number, array: IPermission[]) => {
                        const permission = new Permission(item);
                        this.currentUser.permissions.push(permission);
                    });
                }
                if (body.data.favoriteContacts) {
                    body.data.favoriteContacts.forEach((value: IContact, index: number, array: IContact[]) => {
                        this.currentUser.favorites = new ContactGroup({ contacts: body.data.favoriteContacts, divisions: [] });
                        //let contact = new Contact(value);
                        //this.currentUser.favorites.push(contact);
                    });
                }
                //if (this.currentUser.favorites.contacts.length > 0) {
                //    console.log('favorites not empty. redirect to favs');
                //    this.router.navigate(['/favorites']);
                //}
                if (this.currentUser.getPermissionByCode('phone_book_admin') &&
                    this.currentUser.getPermissionByCode('phone_book_admin').enabled === true) {
                    this.currentUser.isAdministrator = true;
                } else {
                    this.currentUser.isAdministrator = false;
                }

                return {
                    session: this.currentSession,
                    user: this.currentUser
                };
             })
            .take(1)
            .catch(this.handleError);
    };


    logIn(account: string, password: string): Observable<ISessionData|null> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = { action: 'logIn', data: { account: account, password: password }};

        this.loading = true;
        return this.http.post('http://127.0.0.1:4444/api', parameters, options)
            .map((response: Response) => {
                this.loading = false;
                let body = response.json();
                if (isError(body)) {
                    let error = new RuntimeError(body);
                    console.error(error);
                    return error;
                } else {
                    this.currentSession = body.session ? new Session(body.session) : null;
                    this.currentUser = body.user ? new User(body.user) : null;
                    if (body.data.favoriteContacts) {
                        body.data.favoriteContacts.forEach((value: IContact, index: number, array: IContact[]) => {
                            //let contact = new Contact(value);
                            //this.currentUser.favorites.push(contact);
                            this.currentUser.favorites = new ContactGroup({ contacts: body.data.favoriteContacts, divisions: [] });
                        });
                    }

                    if (this.currentUser.getPermissionByCode('phone_book_admin') &&
                        this.currentUser.getPermissionByCode('phone_book_admin').enabled === true) {
                        this.currentUser.isAdministrator = true;
                    } else {
                        this.currentUser.isAdministrator = false;
                    }
                    return {
                        session: this.currentSession,
                        user: this.currentUser
                    };
                }

            })
            .take(1)
            .catch(this.handleError);
    };


    logOut(): Observable<boolean> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = { action: 'logOut', data: { token: this.currentSession !== null ? this.currentSession.token : '' }};

        this.loading = true;
        return this.http.post('http://127.0.0.1:4444/api', parameters, options)
            .map((response: Response) => {
                this.loading = false;
                let result = response.json();
                if (result === true) {
                    this.currentSession = null;
                    this.currentUser = null;
                    document.cookie = 'kolenergo=0; expires=-1 ';
                }
                return result;
            })
            .take(1)
            .catch(this.handleError);
    };





    session(): Session|null {
        return this.currentSession;
    };


    user(): User|null {
        return this.currentUser;
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
