import { forwardRef, Inject, Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { ISessionData, Session } from "../models/session.model";
import { User } from "../models/user.model";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { isError, RuntimeError } from "../models/error.model";
import { IContact, Contact } from "../models/contact.model";
import { ContactGroup } from "../models/contact-group.model";
import { IPermission, Permission } from "../models/permission.model";
import { appConfig, API } from '../app.config';
import { ATS, IATS } from '../models/ats.model';
import { PhoneBookService } from "./phone-book.service";
import { Division, IDivision } from '../models/division.model';
import { IOffice, Office } from "../models/office.model";


@Injectable()
export class SessionService {

    /* Текущая сессия */
    private currentSession: Session | null = null;
    get session(): Session | null { return this.currentSession };


    /* Текущий пользователь */
    private currentUser: User | null = null;
    get user(): User | null { return this.currentUser };


    /* Триггер, выполняется ли загрузка */
    private loading: boolean = false;


    /**
     *
     * @param {Router} router
     * @param {Http} http
     * @param {PhoneBookService} phoneBook
     */
    constructor(private router: Router,
                private http: Http,
                private phoneBook: PhoneBookService) {};


    /**
     * Получение данных о сессии
     * @param token {String} - токен сессии
     * @returns {Observable<R>}
     */
    fetchSessionData(token: string): Observable<ISessionData | null> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = { action: 'getSession', data: { token: token }};

        this.loading = true;
        return this.http.post('http://10.50.0.153:4444/phonebook/session', parameters, options)
            .map((response: Response) => {
                const body = response.json();
                if (body) {
                    /**
                     * Обрабатываем данные текущего пользователя и текущей сессии
                     */
                    this.currentSession = body.session ? new Session(body.session) : null;
                    this.currentUser = body.user ? new User(body.user) : null;
                    if (this.currentUser) {
                        this.currentUser.setupBackup(['officeId', 'room']);
                    }

                    /**
                     * Обрабатываем и устанавливаем позицию фотографии пользователя
                     */
                    if (body.user_photo_position) {
                        this.currentUser.setPhotoPosition(
                            body.user_photo_position.photo_left,
                            body.user_photo_position.photo_top,
                            body.user_photo_position.zoom)
                    }

                    /**
                     * Обрабатываем и добавляем права пользователя
                     */
                    body.permissions.forEach((item: IPermission) => {
                        const permission = new Permission(item);
                        this.currentUser.permissions.push(permission);
                    });
                    if (this.currentUser.getPermissionByCode('phone_book_admin') &&
                        this.currentUser.getPermissionByCode('phone_book_admin').enabled === true) {
                        this.currentUser.isAdministrator = true;
                    }

                    /**
                     * Обработываем и добавляем избранные контакты пользователя
                     */
                    body.favorites.forEach(() => {
                        this.phoneBook.favorites = new ContactGroup({ contacts: body.favorites, divisions: [] });
                    });

                    /**
                     * Обрабатываем и добавляем организации
                     */
                    body.organizations.forEach((item: IDivision) => {
                        let division = new Division(item);
                        division.setupBackup(['parentId', 'title']);
                        this.phoneBook.organizations.push(division);
                    });

                    /**
                     * Обрабатываем и добавляем офисы организаций
                     */
                    body.offices.forEach((item: IOffice) => {
                        let office = new Office(item);
                        office.setupBackup(['organizationId', 'address']);
                        this.phoneBook.offices.push(office);
                    });

                    /**
                     * Обработываем и добавляем структурные подразделения
                     */
                    body.divisions.forEach((value: IDivision) => {
                        const division = new Division(value);
                        division.setupBackup(['parentId', 'title']);
                        this.phoneBook.divisions.push(division);
                        this.phoneBook.ids.push(division.id);
                    });

                    /**
                     * Обработываем и добавляем внутренние АТС
                     */
                    body.ats.inner.forEach((value: IATS) => {
                        const ats = new ATS(value);
                        ats.setupBackup(['parentId', 'type', 'title']);
                        this.phoneBook.innerAts.push(ats);
                        if (ats.id === appConfig.defaultSourceAtsId) {
                            this.phoneBook.currentAts = ats
                        }
                    });

                    /**
                     * Обработываем и добавляем внешние АТС
                     */
                    body.ats.outer.forEach((value: IATS) => {
                        const ats = new ATS(value);
                        ats.setupBackup(['parentId', 'type', 'title']);
                        this.phoneBook.outerAts.push(ats);
                    });

                    return {
                        session: this.currentSession,
                        user: this.currentUser
                    };
                }
                return null;
             })
            .finally(() => { this.loading = false; })
            .take(1)
            .catch(this.handleError);
    };


    /**
     * Авторизация пользователя
     * @param account {String} - учетная запись пользователя
     * @param password {String} - пароль от учетной записи
     * @returns {Observable<R>}
     */
    logIn(account: string, password: string): Observable<ISessionData | null> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = { action: 'logIn', data: { account: account, password: password }};

        this.loading = true;
        return this.http.post('http://10.50.0.153:4444/phonebook/session', parameters, options)
            .map((response: Response) => {
                let body = response.json();
                if (body === null) {
                    //let error = new RuntimeError(body);
                    console.error('No such user');
                    return null;
                } else {
                    /**
                     * Обрабатываем данные текущего пользователя и текущей сессии
                     */
                    this.currentSession = body.session ? new Session(body.session) : null;
                    this.currentUser = body.user ? new User(body.user) : null;
                    if (this.currentUser) {
                        this.currentUser.setupBackup(['officeId', 'room']);
                    }

                    /**
                     * Обрабатываем и добавляем права пользователя
                     */
                    body.permissions.forEach((item: IPermission) => {
                        const permission = new Permission(item);
                        this.currentUser.permissions.push(permission);
                    });
                    if (this.currentUser.getPermissionByCode('phone_book_admin') &&
                        this.currentUser.getPermissionByCode('phone_book_admin').enabled === true) {
                        this.currentUser.isAdministrator = true;
                    }

                    /**
                     * Обработываем и добавляем избранные контакты пользователя
                     */
                    body.favorites.forEach(() => {
                        this.phoneBook.favorites = new ContactGroup({ contacts: body.favorites, divisions: [] });
                    });

                    /**
                     * Если у пользователя есть избранные контакты - переходим в режим отображения избранных контактов
                     */
                    if (this.phoneBook.favorites.contacts.length > 0) {
                        this.phoneBook.isInFavoritesMode = true;
                    }

                    if (this.phoneBook.favorites.contacts.length > 0) {
                        this.router.navigate(['/favorites']);
                    }

                    return {
                        session: this.currentSession,
                        user: this.currentUser
                    };
                }

            })
            .finally(() => {
                this.loading = false;
            })
            .take(1)
            .catch(this.handleError);
    }


    /**
     * Завершение сеанса пользователя
     * @returns {Observable<R>}
     */
    logOut(): Observable<boolean> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = {
            action: 'logOut',
            data: {
                token: this.currentSession !== null ? this.currentSession.token : ''
            }
        };

        this.loading = true;
        return this.http.post('http://10.50.0.153:4444/phonebook/session', parameters, options)
            .map((response: Response) => {
                let result = response.json();
                if (result === true) {
                    this.currentSession = null;
                    this.currentUser = null;
                    this.phoneBook.favorites.clearContacts();
                    if (this.phoneBook.isInFavoritesMode) {
                        this.phoneBook.isInFavoritesMode = false;
                        this.phoneBook.contacts = [];
                    }
                }
                return result;
            })
            .finally(() => {
                this.loading = false;
            })
            .take(1)
            .catch(this.handleError);
    }



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
