import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ISessionData, Session } from "../../models/session.model";
import { User } from "../../models/user.model";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';


@Injectable()
export class SessionService {
    private currentSession: Session|null = null;
    private currentUser: User|null = null;
    private loading: boolean = false;


    /**
     * Конструктор
     * @param http {Http}
     */
    constructor (private http: Http) {};


    fetchSessionData(token: string): Observable<ISessionData> {
        if (token) {
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });
            let parameters = { token: token };

            this.loading = true;
            return this.http.post('http://127.0.0.1:4444/api', parameters, options)
                .map((response: Response) => {
                    this.loading = false;
                    let body = response.json();
                    this.currentSession = body.session ? new Session(body.session) : null;
                    this.currentUser = body.user ? new User(body.user) : null;
                    return {
                        session: this.currentSession,
                        user: this.currentUser
                    };
                })
                .take(1)
                .catch(this.handleError);
        }
    };


    logIn(account: string, password: string): Observable<ISessionData|null> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = {
            action: 'logIn',
            data: {
                account: account,
                password: password
            }
        };

        this.loading = true;
        return this.http.post('http://127.0.0.1:4444/api', parameters, options)
            .map((response: Response) => {
                this.loading = false;
                let body = response.json();
                this.currentSession = body.session ? new Session(body.session) : null;
                this.currentUser = body.user ? new User(body.user) : null;
                return {
                    session: this.currentSession,
                    user: this.currentUser
                };
            })
            .take(1)
            .catch(this.handleError);
    };


    logOut(): Observable<boolean> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        this.loading = true;
        return this.http.post('http://127.0.0.1:4444/api', options)
            .map((response: Response) => {
                this.loading = false;
                let result = response.json();
                if (result) {
                    this.currentSession = null;
                    this.currentUser = null;
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
