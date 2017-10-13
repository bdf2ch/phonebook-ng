import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Contact } from '../models/contact.model';
import { Division } from '../models/division.model';
import { Phone } from '../models/phone.model';
import { ContactGroup } from '../models/contact-group.model';
import { API, appConfig } from '../app.config';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';


@Injectable()
export class PhoneBookManagerService {
    /* Триггер полученя данных с сервера */
    private loading: boolean = false;


    /**
     * Конструктор сервиса
     * @param http {Http} - Http injector
     */
    constructor(private http: Http) {};


    /**
     * Редактиросвание данных абонента
     * @param contact {Contact} - редактируемыцй абонент
     * @returns {Observable<Contact>}
     */
    editContact(contact: Contact): Observable<Contact> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let params = {
            action: "editContact",
            data: {
                contactId: contact.id,
                name: contact.name,
                fname: contact.fname,
                surname: contact.surname,
                position: contact.position,
                email: contact.email,
                mobile: contact.mobile
            }
        };
        this.loading = true;
        return this.http.post(appConfig.apiUrl, params, options)
            .map((res: Response) => {
                this.loading = false;
                const body = res.json();
                const cnt = new Contact(body);
                return cnt;
            })
            .take(1)
            .catch(this.handleError);
    };


    /**
     * Перемещение абонента в структурное подразделение
     * @param contact {Contact} - перемещаемый абонент
     * @param division {Division} - целевое структурное подразделение
     * @param group {ContactGroup} - группа контактов, к которой относится перемещаемый абонент
     * @returns {Observable<R>}
     */
    setContactDivision(contact: Contact, division: Division, group: ContactGroup, sourceAtsId: number): Observable<Contact> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let parameters = {
            action: 'setContactDivision',
            data: {
                contactId: contact.id,
                divisionId: division.id,
                sourceAtsId: sourceAtsId
            }
        };

        return this.http.post(appConfig.apiUrl, parameters, options)
            .map((response: Response) => {
                let body = response.json();
                let contact = new Contact(body);
                console.log(contact);
                console.log('group contacts', group.contacts);
                group.removeContact(contact);
                //this.nowDragging = null;
                return contact;
            })
            .take(1)
            .catch(this.handleError);
    };


    /**
     * Добавление телефона абоненту
     * @param contactId {number} - идентификатор абонента
     * @param atsId {number} - идентификатор АТС
     * @param number {string} - номекр телефона
     * @returns {Observable<R>}
     */
    addContactPhone(contactId: number, atsId: number, number: string): Observable<Phone> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const parameters = { action: 'addContactPhone', data: { contactId: contactId, atsId: atsId, number: number}};

        return this.http.post(appConfig.apiUrl, parameters, options)
            .map((response: Response) => {
                const body = response.json();
                const phone = new Phone(body);
                phone.setupBackup(['atsId', 'number']);
                console.log('phone', phone);
                return phone;
            })
            .take(1)
            .catch(this.handleError);
    };


    /**
     * Сохраняет информацию о телефоне абонента
     * @param phone
     * @returns {Observable<R>}
     */
    editContactPhone(phone: Phone): Observable<Phone> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const parameters = { action: 'editContactPhone',
            data: {
                phoneId: phone.id,
                atsId: phone.atsId,
                number: phone.number
            }
        };

        this.loading = true;
        return this.http.post(appConfig.apiUrl, parameters, options)
            .map((response: Response) => {
                phone.setupBackup(['atsId', 'number']);
                console.log('phone', phone);
                return phone;
            })
            .take(1)
            .finally(() => { this.loading = false; })
            .catch(this.handleError);
    };


    /**
     * Удаляет телефон абонента
     * @param phone {Phone} - телефон абонента
     * @returns {Observable<R>}
     */
    deleteContactPhone(phone: Phone): Observable<boolean> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const parameters = { action: 'deleteContactPhone', data: { phoneId: phone.id }};

        this.loading = true;
        return this.http.post(appConfig.apiUrl, parameters, options)
            .map((response: Response) => {
                const body = response.json();
                return body;
            })
            .take(1)
            .finally(() => { this.loading = false; })
            .catch(this.handleError);
    };


    /**
     * Добавление нового структурного подразделения
     * @param division {Division} - Добавляемое структурное подразделение
     * @returns {Observable<R>}
     */
    addDivision(division: Division): Observable<Division> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const parameters = {
            action: 'addDivision',
            data: {
                parentId: division.parentId,
                title: division.title
            }
        };

        this.loading = true;
        return this.http.post(appConfig.apiUrl, parameters, options)
            .map((response: Response) => {
                const body = response.json();
                const division_ = new Division(body);
                division_.setupBackup(['parentId', 'title']);
                return division_;
            })
            .take(1)
            .finally(() => { this.loading = false; })
            .catch(this.handleError);
    };


    /**
     * Изменение структурного подразделения
     * @param division {Division} - изменяемое структурное подразделение
     * @returns {Observable<R>}
     */
    editDivision(division: Division): Observable<Boolean> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        const parameters = {
            action: 'editDivision',
            data: {
                id: division.id,
                parentId: division.parentId,
                title: division.title
            }
        };

        this.loading = true;
        return this.http.post(appConfig.apiUrl, parameters, options)
            .map((response: Response) => {
                const body = response.json();
                if (body) {
                    division.setupBackup(['parentId', 'title']);
                    return true;
                }
                return false;
            })
            .take(1)
            .finally(() => { this.loading = false; })
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
