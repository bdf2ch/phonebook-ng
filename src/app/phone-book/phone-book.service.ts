import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Contact } from "../models/Contact.model";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
//import { SessionService } from "./session.service";
import { Division, IDivision } from "../models/Division.model";
import { ContactGroup, IContactGroup } from "../models/contact-group.model";


@Injectable()
export class PhoneBookService {
  private apiUrl: string = 'http://127.0.0.1:4444/api';
  private contacts: Division[] = [];
  private favorites: Contact[] = [];
  private divisions: Division[] = [];
  private groups: ContactGroup[] = [];
  loading: boolean = false;
  searchMode: boolean = false;
  searchQuery: string = '';


  /**
   * Конструктор сервиса
   * @param $http {Http}
   * @param $session {SessionService}
   */
  constructor(
      private http: Http
      //private $session: SessionService
  ) {};


  fetchDivisionList(): Observable<Division[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = { action: 'getDivisionList' };

    return this.http.post(this.apiUrl, parameters, options)
        .map((res: Response) => {
          let body = res.json();
          body.forEach((item: IDivision) => {
            let division = new Division(item);
            this.divisions.push(division);
          });
          console.log(this.divisions);
          return this.divisions;
        })
        .take(1)
        .catch(this.handleError);
  };



  fetchContactsByDivisionId(id: number): Observable<ContactGroup[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = { action: 'getContactGroupsByDivisionId', data: { divisionId: id }};

    return this.http.post(this.apiUrl, parameters, options)
      .map((res: Response) => {
        this.clearContactGroups();
        const body = res.json();
        body.forEach((item: IContactGroup) => {
            const contactGroup = new ContactGroup(item);
            this.groups.push(contactGroup);
        });
        return this.groups;
      })
      .take(1)
      .catch(this.handleError);
  };


  getDivisionList(): Division[] {
    return this.divisions;
  };

  getContactGroupList(): ContactGroup[] {
    return this.groups;
  };


  getDivisionById(id: number): Division|undefined {
    const divisionById = (item: Division, index: number, divisions: Division[]) => item.id === id;
    return this.divisions.find(divisionById);
  };


  clearContactGroups(): void {
    this.groups = [];
  };


  /**
   * Осуществляет поиск контактов на сервере в соответствии с условием поиска
   * @returns {Observable<Contact|null>}
   */
  searchContacts(): Observable<Contact[]>|null {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let params = { action: "searchContacts", data: { search: this.searchQuery } };
    this.searchMode = true;
    this.loading = true;

    return this.http.post(this.apiUrl, params, options)
      .map((res: Response|null) => {
        this.loading = false;
        let body = res.json();
        if (body !== null) {
          let length = body.length;
          //this.clear();
          for (let i = 0; i < length; i++) {
            let division = new Division(body[i].division);
            let x = body[i].contacts.length;
            for (let z = 0; z < x; z++) {
              let contact = new Contact(body[i].contacts[z]);
              //division.contacts.push(contact);
            }
            this.contacts.push(division);
          }
          this.loading = false;
        } else
          return null;
      })
      .take(1)
      .catch(this.handleError);
  };


  /**
   * Добавляет контакт в избранные
   * @param contactId {number} - идентификатор контакта
   * @param userId {number} - идентификатор пользователя
   * @returns {Observable<R>}
   */
  addContactToFavorites (contactId: number, userId: number): Observable<Contact> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = { action: 'addContactToFavorites', data: { contactId: contactId, userId: userId }};
    this.loading = true;

    return this.http.post(this.apiUrl, parameters, options)
      .map((response: Response) => {
        this.loading = false;
        let body = response.json();
        let contact = new Contact(body);
        this.favorites.push(contact);
      })
      .take(1)
      .catch(this.handleError);
  };


  /**
   * Удаляет контакт из избранных
   * @param contactId
   * @param userId
   * @returns {Observable<R>}
   */
  deleteContactFromFavorites(contactId: number, userId: number): Observable<boolean> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = { action: 'deleteContactFromFavorites', data: { contactId: contactId, userId: userId }};
    this.loading = true;

    return this.http.post(this.apiUrl, parameters, options)
      .map((response: Response) => {
        this.loading = false;
        let body = response.json();
        if (body === true) {
          let length = this.favorites.length;
          for (let i = 0; i < length; i++) {
            if (this.favorites[i].id === contactId) {
              this.favorites.splice(i, 1);
              return true;
            }
          }
          return false;
        }
      })
      .take(1)
      .catch(this.handleError);
  };



  /**
   * Возвращает массив избранных контактов
   * @returns {Contact[]}
   */
  getFavorites(): Contact[] {
    return this.favorites;
  };


  /**
   *
   * @param contact
   * @returns {boolean}
   */
  isContactInFavorites(contact: Contact): boolean {
    let length = this.favorites.length;
    for (let i = 0; i < length; i++) {
      if (this.favorites[i].id === contact.id)
        return true;
    }
    return false;
  };




  /**
   * Возвращает состояние режима поиска
   * @returns {boolean}
   */
  isInSearchMode(): boolean {
    return this.searchMode;
  };


  isLoading(): boolean {
    return this.loading;
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

}
