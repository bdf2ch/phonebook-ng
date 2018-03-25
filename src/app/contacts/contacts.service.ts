import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { PhoneBookService } from "../shared/phone-book/phone-book.service";
import { SessionService } from "../shared/session/session.service";
import { ContactGroup, IContactGroup } from "../models/contact-group.model";
import { Contact } from "../models/contact.model";


@Injectable()
export class ContactsService {
    public contacts: Observable<ContactGroup[]>;
    private contactsCount: number;
    private newContact: Contact;
    public searchQuery: string;
    public isLoading: boolean;
    public isSearching: boolean;
    public isAdding: boolean;
    public isEditing: boolean;


    constructor(private http: Http,
                private session: SessionService,
                private phoneBook: PhoneBookService) {
        this.contactsCount = 0;
        this.searchQuery = '';
        this.newContact = new Contact();
        this.newContact.setupBackup([
            'userId', 'divisionId', 'officeId', 'name', 'fname', 'surname', 'position', 'email', 'mobile', 'photo',
            'room', 'order'
        ]);
        this.isLoading = false;
        this.isSearching = false;
        this.isAdding = false;
        this.isEditing = false;
    };


    /**
     * Возвращает нового абонента
     * @returns {Contact}
     */
    new(): Contact {
        return this.newContact;
    };


    /**
     * Поиск абонентов
     * @param {string} query - Строка поиска
     * @param {number} sourceAtsId - Идентификатор исходной АТС
     * @param {number} userId - Идентификатор пользователя
     * @returns {Observable<ContactGroup[]>}
     */
    search(query: string, sourceAtsId: number, userId: number): Observable<ContactGroup[]> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let parameters = {
            action: 'search',
            data: {
                search: query,
                sourceAtsId: sourceAtsId,
                userId: userId
            }
        };

        this.contactsCount = 0;
        this.isSearching = true;
        let res = this.http.post('http://10.50.0.153:4444/phonebook/contacts', parameters, options)
            .map((res: Response) => {
                let body = res.json();
                let result: ContactGroup[] = [];
                body.forEach((item: IContactGroup) => {
                    let group = new ContactGroup(item);
                    result.push(group);
                    this.contactsCount++;
                });
                return result;
            })
            .take(1)
            .finally(() => {this.isSearching = false; })
            .catch(this.handleError);
        this.contacts = res;
        return res;
    };


    /**
     * Очищает поиск
     */
    clearSearch(): void {
        this.searchQuery = '';
        this.contactsCount = 0;
        this.contacts = Observable.of<ContactGroup[]>([]);
    };


    /**
     * Получение перечня абонентов по идентификатору структурного подразделения
     * @param {number} divisionId - Идентификатор структурного подразделения
     * @param {number} sourceAtsId - Идентфиикатор исходной АТС
     * @param {string} token - Токен сессии пользователя
     * @returns {Observable<ContactGroup[]>}
     */
    getByDivisionId(divisionId: number, sourceAtsId: number, token: string): Observable<ContactGroup[]> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let parameters = {
            action: 'getByDivisionId',
            data: {
                divisionId: divisionId,
                sourceAtsId: sourceAtsId,
                token: token
            }
        };

        this.contactsCount = 0;
        this.isLoading = true;
        return this.http.post('http://10.50.0.153:4444/phonebook/contacts', parameters, options)
            .map((res: Response) => {
                const body = res.json();
                let result: ContactGroup[] = [];
                const group = new ContactGroup(body);
                result.push(group);
                this.contactsCount = group.contacts.length;
                return result;
            })
            .take(1)
            .finally(() => {this.isLoading = false; })
            .catch(this.handleError);
    };


    /**
     * Получение абонентов по идентификатору структурного подразделения, рекурсивно
     * @param {number} divisionId - Идентификатор структурного подразделения
     * @param {number} sourceAtsId - Идентификатор исходной АТС
     * @param {string} token - Токен сессии пользователя
     * @returns {Observable<ContactGroup[]>}
     */
    getByDivisionIdRecursive(divisionId: number, sourceAtsId: number, token: string): Observable<ContactGroup[]> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let parameters = {
            action: 'getByDivisionIdRecursive',
            data: {
                divisionId: divisionId,
                sourceAtsId: sourceAtsId,
                token: token
            }
        };

        this.contactsCount = 0;
        this.isLoading = true;
        let res = this.http.post('http://10.50.0.153:4444/phonebook/contacts', parameters, options)
            .map((res: Response) => {
                const body = res.json();
                let result: ContactGroup[] = [];
                body.forEach((item: IContactGroup) => {
                    const group = new ContactGroup(item);
                    this.contactsCount += group.contacts.length;
                    result.push(group);
                });
                return result;
            })
            .take(1)
            .finally(() => {this.isLoading = false; })
            .catch(this.handleError);
        this.contacts = res;
        return res;
    };


    /**
     * Добавление нового абонента
     * @param {Contact} contact - Добавляемый абонент
     * @param {string} token - Токен сессии пользователя
     * @returns {Observable<Contact | boolean>}
     */
    add(contact: Contact, token: string): Observable<Contact | boolean> {
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const parameters = {
            action: 'add',
            data: {
                userId: contact.userId,
                divisionId: contact.divisionId,
                officeId: contact.officeId,
                name: contact.name,
                fname: contact.fname,
                surname: contact.surname,
                position: contact.position,
                email: contact.email,
                mobile: contact.mobile,
                room: contact.room ? contact.room : '',
                order: contact.order,
                token: token
            }
        };

        this.isAdding = true;
        return this.http.post('http://10.50.0.153:4444/phonebook/contacts', parameters, options)
            .map((response: Response) => {
                let answer = response.json();
                if (answer.error !== null) {
                    console.error(answer.error);
                    return false;
                } else {
                    let newlyAddedContact = new Contact(answer.result);
                    newlyAddedContact.setupBackup([
                        'userId', 'divisionId', 'officeId', 'surname', 'name', 'fname', 'position', 'email', 'mobile',
                        'photo', 'order', 'room'
                    ]);
                    return newlyAddedContact;
                }
            })
            .take(1)
            .finally(() => {this.isAdding = false; })
            .catch(this.handleError);
    };


    /**
     * Возвращает текущее количество абонентов
     * @returns {number}
     */
    total(): number {
        return this.contactsCount;
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
        console.error(errMsg);
        return Observable.throw(errMsg);
    };
}