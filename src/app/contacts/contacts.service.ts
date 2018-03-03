import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { ContactGroup, IContactGroup } from "../models/contact-group.model";
import { Subject } from "rxjs/Subject";
import 'rxjs/operator/debounceTime';
import 'rxjs/operator/distinctUntilChanged';
import {PhoneBookService} from "../phone-book/phone-book.service";
import {SessionService} from "../phone-book/session.service";


@Injectable()
export class ContactsService {
    public contacts: Observable<ContactGroup[]>;
    public searchQuery: string;
    public searchStream: Subject<string>;
    public isLoading: boolean;
    public isSearching: boolean;
    public isAdding: boolean;
    public isEditing: boolean;


    constructor(private http: Http,
                private session: SessionService,
                private phoneBook: PhoneBookService) {
        this.searchStream = new Subject<string>();
        this.searchQuery = '';
        this.isLoading = false;
        this.isSearching = false;
        this.isAdding = false;
        this.isEditing = false;

        /*
        this.contacts = this.searchStream
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap((term) => {
                console.log('search term injector', term);
                return term ? this.search(term, this.phoneBook.selectedAts.id, this.session.user ? this.session.user.id : 0) : Observable.of<ContactGroup[]>([])
            });
            */
        //this.searchStream.subscribe();
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

        this.isSearching = true;
        let res = this.http.post('http://10.50.0.153:4444/phonebook/contacts', parameters, options)
            .map((res: Response) => {
                let body = res.json();
                let result: ContactGroup[] = [];
                body.forEach((item: IContactGroup) => {
                    let group = new ContactGroup(item);
                    result.push(group);
                });
                return result;
            })
            .take(1)
            .finally(() => {this.isSearching = false; })
            .catch(this.handleError);
        this.contacts = res;
        return res;
    };


    clearSearch(): void {
        this.searchQuery = '';
    };


    /**
     * Получение перечня абонентов по идентификатору структурного подразделения
     * @param {number} divisionId - Идентификатор структурного подразделения
     * @param {number} sourceAtsId - Идентфиикатор исходной АТС
     * @param {string} token - Токен сессии пользователя
     * @returns {Observable<ContactGroup[]>}
     */
    byDivisionId(divisionId: number, sourceAtsId: number, token: string): Observable<ContactGroup[]> {
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

        this.isLoading = true;
        return this.http.post('http://10.50.0.153:4444/phonebook/contacts', parameters, options)
            .map((res: Response) => {
                const body = res.json();
                let result: ContactGroup[] = [];
                const group = new ContactGroup(body);
                result.push(group);
                return result;
            })
            .take(1)
            .finally(() => {this.isLoading = false; })
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
        console.error(errMsg);
        return Observable.throw(errMsg);
    };
}