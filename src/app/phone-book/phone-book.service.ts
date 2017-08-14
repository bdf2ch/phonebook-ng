import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Contact } from "../models/contact.model";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { SessionService } from "../utilities/session/session.service";
import { Division, IDivision } from "../models/Division.model";
import { ContactGroup, IContactGroup } from "../models/contact-group.model";
import {ATS, IATS} from "../models/ats.model";
import {Phone} from "../models/phone.model";


@Injectable()
export class PhoneBookService {
  private apiUrl: string = 'http://127.0.0.1:4444/api';
  private contacts: Division[] = [];
  private favorites: Contact[] = [];
  private divisions: Division[] = [];
  private innerATS: ATS[] = [];
  private outerATS: ATS[] = [];
  private groups: ContactGroup[] = [];
  private visibleGroups: ContactGroup[] = [];
  private loadingInProgress: boolean = false;
  private currentDivision: Division | null = null;
  private currentContact: Contact | null = null;
  loading: boolean = false;
  searchMode: boolean = false;
  public searchQuery: string = '';


  /**
   * Конструктор сервиса
   * @param $http {Http}
   * @param $session {SessionService}
   */
  constructor(private router: Router,
              private http: Http,
              private session: SessionService
  ) {};


  fetchInitialData(): Observable<any> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let parameters = { action: 'getInitialData' };

      return this.http.post(this.apiUrl, parameters, options)
          .map((res: Response) => {
              let body = res.json();
              console.log(body);

              if (body.divisions) {
                  body.divisions.forEach((item: IDivision) => {
                      let division = new Division(item);
                      division.setupBackup(['parentId', 'title']);
                      this.divisions.push(division);
                  });
              }

              if (body.ats) {
                  body.ats.inner.forEach((item: IATS) => {
                      let ats = new ATS(item);
                      ats.setupBackup(['parentId', 'type', 'title']);
                      this.innerATS.push(ats);
                  });
                  body.ats.outer.forEach((item: IATS) => {
                      let ats = new ATS(item);
                      ats.setupBackup(['parentId', 'type', 'title']);
                      this.outerATS.push(ats);
                  });
              }

              console.log(this.divisions);
              return this.divisions;
          })
          .take(1)
          .catch(this.handleError);
  };


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
    let parameters = {
      action: 'getContactGroupsByDivisionId',
      data: {
        divisionId: id,
        token: this.session.session() ? this.session.session().token : ''
      }
    };

    this.loadingInProgress = true;
    return this.http.post(this.apiUrl, parameters, options)
      .map((res: Response) => {
        this.clearContactGroups();
        this.loadingInProgress = false;
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

  getInnerATSList(): ATS[] {
      return this.innerATS;
  };


  getOuterATSList(): ATS[] {
      return this.outerATS;
  };

  getContactGroupList(): ContactGroup[] {
    return this.groups;
  };

  isLoadingInProgress(): boolean {
    return this.loadingInProgress;
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
   * @returns {Observable<ContactGroup|null>}
   */
  searchContacts(): Observable<ContactGroup[]>|null {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let params = { action: "searchContacts", data: { search: this.searchQuery } };
    this.searchMode = true;
    this.loading = true;

    return this.http.post(this.apiUrl, params, options)
      .map((res: Response) => {
        this.loading = false;
        this.clearContactGroups();
        let body = res.json();
        body.forEach((item: IContactGroup) => {
          let group = new ContactGroup(item);
          this.groups.push(group);
          console.log(group);
          return group;
        });
      })
      .take(1)
      .catch(this.handleError);
  };


  editContact(contact: Contact): Observable<Contact> {
      let headers = new Headers({ "Content-Type": "application/json" });
      let options = new RequestOptions({ headers: headers });
      let params = {
          action: "editContact",
          data: {
              id: contact.id,
              name: contact.name,
              fname: contact.fname,
              surname: contact.surname,
              position: contact.position,
              email: contact.email,
              mobile: contact.mobile
          }
      };
      this.loading = true;

      return this.http.post(this.apiUrl, params, options)
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
   * Добавляет контакт в избранные
   * @param contactId {number} - идентификатор контакта
   * @returns {Observable<R>}
   */
  addContactToFavorites (contactId: number): Observable<Contact> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = {
      action: 'addContactToFavorites',
      data: {
        contactId: contactId,
        token: this.session.session() ? this.session.session().token : ''
      }
    };
    this.loading = true;

    return this.http.post(this.apiUrl, parameters, options)
      .map((response: Response) => {
        this.loading = false;
        let body = response.json();
        let contact = new Contact(body);
        if (this.session.user()) {
          this.session.user().favorites.contacts.push(contact);
        }
        return contact;
      })
      .take(1)
      .catch(this.handleError);
  };


  /**
   * Удаляет контакт из избранных
   * @param contactId
   * @returns {Observable<R>}
   */
  removeContactFromFavorites(contactId: number): Observable<boolean> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = {
      action: 'removeContactFromFavorites',
      data: {
        contactId: contactId,
        token: this.session.session() ? this.session.session().token : ''
      }
    };
    this.loading = true;

    return this.http.post(this.apiUrl, parameters, options)
      .map((response: Response) => {
        this.loading = false;
        let body = response.json();
        if (body === true) {
          this.session.user().favorites.contacts.forEach((contact: Contact, index: number, array: Contact[]) => {
            if (contact.id === contactId) {
              array.splice(index, 1);
            }
          });
          return true;
        }
      })
      .take(1)
      .catch(this.handleError);
  };


  setContactDivision(contactId: number, divisionId: number): Observable<Contact> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = { action: 'setContactDivision', data: { contactId: contactId, divisionId: divisionId }};

    return this.http.post(this.apiUrl, parameters, options)
        .map((response: Response) => {
          let body = response.json();
          let contact = new Contact(body);
          console.log(contact);
          return contact;
        })
        .take(1)
        .catch(this.handleError);
  };


  addContactPhone(contactId: number, atsId: number, number: string): Observable<Phone> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    const parameters = { action: 'addContactPhone', data: { contactId: contactId, atsId: atsId, number: number}};

    return this.http.post(this.apiUrl, parameters, options)
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


    uploadUserPhoto(userId: number, photo: File): Observable<string> {
        console.log('photo', photo);
        let headers = new Headers({ 'Accept': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let formData = new FormData();
        formData.append('photo', photo);
        formData.append('userId', userId.toString());

        this.loading = true;
        return this.http.post('http://127.0.0.1:4444/uploadPhoto', formData, options)
            .map((response: Response) => {
                this.loading = false;
                let result = response.json();
                console.log('photo url', result);
                if (this.session.user()) {
                    // Если фото загружено для текущего пользователя - меняем фото
                    if (this.session.user().id === userId) {
                        this.session.user().photo = result;
                    }
                    // Если контакт находится в избранных - меняем фото
                    if (this.session.user().favorites.contacts.length > 0) {
                        this.session.user().favorites.contacts.forEach((contact: Contact, index: number, array: Contact[]) => {
                            if (contact.userId === userId) {
                                contact.photo = result;
                            }
                        });
                    }
                }
                return result;
            })
            .take(1)
            .catch(this.handleError);
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


  selectedDivision(division?: Division | null): Division | null {
    if (division) {
      this.currentDivision = division;
    }
    return this.currentDivision;
  };


  selectedContact(contact?: Contact | null): Contact | null {
      if (contact || contact === null) {
          this.currentContact = contact;
      }
      return this.currentContact;
  };


  clearSearch(): void {
      this.searchQuery = '';
      if (this.currentDivision !== null) {
          this.fetchContactsByDivisionId(this.currentDivision.id)
              .subscribe();
      } else {
          this.groups = [];
      }
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
