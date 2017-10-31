import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Contact } from "../models/contact.model";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { SessionService } from "./session.service";
import { Division, IDivision } from "../models/division.model";
import { ContactGroup, IContactGroup } from "../models/contact-group.model";
import {ATS, IATS} from "../models/ats.model";
import {Phone} from "../models/phone.model";
import { IDraggableContact } from '../models/draggable-contact.interface';
import { ContactGroupComponent } from './contact-group/contact-group.component';


import { API, uploadURL, appConfig } from '../app.config';
import { IContactPhotoPosition } from '../models/user-photo-position.interface';


@Injectable()
export class PhoneBookService {
  private groups: ContactGroup[] = [];
  searchMode: boolean = false;

  public _dragging: IDraggableContact | null = null;


  /* Отображаемые абоненты */
  public currentContacts: ContactGroup[] = [];
  get contacts(): ContactGroup[] { return this.currentContacts };
  set contacts(value: ContactGroup[]) { this.currentContacts = value };


  private cachedContacts: ContactGroup[] = [];
  get cache(): ContactGroup[] { return this.cachedContacts };
  set cache(value: ContactGroup[]) { this.cachedContacts = value };

  /* Перечень организаций */
  public organizationList: Division[] = [];
  get organizations(): Division[] { return this.organizationList };
  set organizations(value: Division[]) { this.organizationList = value; };

  /* Перечень структурных подразделений */
  public divisionsList: Division[] = [];
  get divisions(): Division[] { return this.divisionsList };
  set divisions(value: Division[]) { this.divisionsList = value };

  /* Перечень внутренних АТС */
  public innerAtsList: ATS[] = [];
  get innerAts(): ATS[] { return this.innerAtsList };
  set innerAts(value: ATS[]) { this.innerAtsList = value };

  /* Перечень внешних АТС */
  public outerAtsList: ATS[] = [];
  get outerAts(): ATS[] { return this.outerAtsList };
  set outerAts(value: ATS[]) { this.outerAtsList = value };

  /* Избранные контакты текущего пользователя */
  public favoriteContacts: ContactGroup = new ContactGroup();
  get favorites(): ContactGroup { return this.favoriteContacts };
  set favorites(value: ContactGroup) { this.favoriteContacts = value };

  /* Триггер, выбран ли режим отображения избранных контактов текущего пользователя */
  public isInFavoriteContactsViewMode: boolean = false;
  get isInFavoritesMode(): boolean { return this.isInFavoriteContactsViewMode };
  set isInFavoritesMode(value: boolean) {
      this.isInFavoriteContactsViewMode = value;
      if (value === true) {
          this.contacts = [];
          this.contacts.push(this.favorites);
      }
  };

  /* Триггер, используется ли режим поиска абонентов */
  public isInSearchContactsMode: boolean = false;
  get isInSearchMode(): boolean { return this.isInSearchContactsMode };
  set isInSearchMode(value: boolean) { this.isInSearchContactsMode = value };


  public isInUserAccountViewMode: boolean = false;
  get isInUserAccountMode(): boolean { return this.isInUserAccountViewMode };
  set isInUserAccountMode(value: boolean) { this.isInUserAccountViewMode = value };

  /* Выбранная АТС */
  public currentAts: ATS | null = null;
  get selectedAts(): ATS | null { return this.currentAts };
  set selectedAts(value: ATS | null) { this.currentAts = value };

  /* Выбранная организация */
  public currentOrganization: Division | null = null;
  get selectedOrganization(): Division | null { return this.currentOrganization };
  set selectedOrganization(value: Division | null) { this.currentOrganization = value };

  /* Выбранное структурное подразделение */
  public currentDivision: Division | null = null;
  get selectedDivision(): Division | null { return this.currentDivision };
  set selectedDivision(value: Division | null) { this.currentDivision = value };

  /* Выбранный абонент */
  public currentContact: Contact | null = null;
  get selectedContact(): Contact | null { return this.currentContact };
  set selectedContact(value: Contact | null) { this.currentContact = value };

  /* Строка поиска абонентов */
  public searchQuery: string = '';
  get search(): string { return this.searchQuery };
  set search(value: string) { this.searchQuery = value };

  /* Триггер, выполняется ли загрузка данных */
  public loadingInProgress: boolean = false;
  get loading(): boolean { return this.loadingInProgress };
  set loading(value: boolean) { this.loadingInProgress = value };



  get nowDragging() : IDraggableContact | null {
      return this._dragging;
  };

  set nowDragging(data: IDraggableContact | null) {
      this._dragging = data;
  };


  public ids: number[] = [];
  public randomId(): number {
      return Math.floor(Math.random() * this.ids.length);
  };


  /**
   * Конструктор сервиса
   * @param $http {Http} - Http injector
   */
  constructor(private http: Http) {};



  fetchInitialData(): Observable<any> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let parameters = { action: 'getInitialData' };

      return this.http.post(appConfig.apiUrl, parameters, options)
          .map((res: Response) => {
              let body = res.json();
              console.log(body);

              body.organizations.forEach((item: IDivision) => {
                  let division = new Division(item);
                  division.setupBackup(['parentId', 'title']);
                  this.organizations.push(division);
              });

              body.divisions.forEach((item: IDivision) => {
                  let division = new Division(item);
                  division.setupBackup(['parentId', 'title']);
                  this.divisions.push(division);
              });

              body.ats.inner.forEach((item: IATS) => {
                  let ats = new ATS(item);
                  ats.setupBackup(['parentId', 'type', 'title']);
                  this.innerAts.push(ats);
                  if (ats.id === 17) {
                      this.currentAts = ats;
                  }
              });

              body.ats.outer.forEach((item: IATS) => {
                  let ats = new ATS(item);
                  ats.setupBackup(['parentId', 'type', 'title']);
                  this.outerAts.push(ats);
              });

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

    return this.http.post(appConfig.apiUrl, parameters, options)
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


  /**
   * Получение контактов по идентификатору структурного подразделения
   * @param divisionId {number} - идентификатор структурного подразделения
   * @param sourceAtsId {number} - идентификатор исходной АТС
   * @param token {string} - токен сессии
   * @returns {Observable<R>}
   */
  fetchContactsByDivisionId(divisionId: number, sourceAtsId: number, token: string): Observable<ContactGroup> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let parameters = {
          action: 'getContactsByDivisionId',
          data: {
              divisionId: divisionId,
              sourceAtsId: sourceAtsId,
              token: token
          }
      };

      this.loading = true;
      this.contacts = [];
      this.isInFavoritesMode = false;
      this.isInSearchMode = false;
      return this.http.post(appConfig.apiUrl, parameters, options)
          .map((res: Response) => {
              const body = res.json();
              const group = new ContactGroup(body);
              this.contacts.push(group);
              return this.contacts;
          })
          .take(1)
          .finally(() => { this.loading = false; })
          .catch(this.handleError);
  };


  fetchContactsByDivisionIdRecursive(divisionId: number, sourceAtsId: number, token: string): Observable<ContactGroup[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = {
      action: 'getContactGroupsByDivisionIdRecursive',
      data: {
          divisionId: divisionId,
          sourceAtsId: sourceAtsId,
          token: token
      }
    };

    this.loading = true;
    this.contacts = [];
    this.isInFavoritesMode = false;
    this.isInSearchMode = false;
    return this.http.post(appConfig.apiUrl, parameters, options)
      .map((res: Response) => {
        const body = res.json();
        body.forEach((item: IContactGroup) => {
            const group = new ContactGroup(item);
            this.contacts.push(group);
        });
        return this.contacts;
      })
      .take(1)
        .finally(() => { this.loading = false; })
      .catch(this.handleError);
  };


  fetchFavoriteContacts(userId: number, sourceAtsId: number): Observable<Contact[]> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let parameters = {
          action: 'getFavoriteContacts',
          data: {
              userId: userId,
              sourceAtsId: sourceAtsId,
          }
      };

      this.loading = true;
      return this.http.post(appConfig.apiUrl, parameters, options)
          .map((res: Response) => {
              const body = res.json();
              //body.forEach((item: IContactGroup) => {
                  const group = new ContactGroup({ contacts: body, divisions: [] });
                  this.favorites = group;
                  this.contacts = [];
                  this.contacts.push(group);
              //});
              return this.groups;
          })
          .take(1)
          .finally(() => {
            this.loading = false;
          })
          .catch(this.handleError);
  };



  getDivisionById(id: number): Division|undefined {
    const divisionById = (item: Division, index: number, divisions: Division[]) => item.id === id;
    return this.divisions.find(divisionById);
  };


  getDivisionsByOrganization(organization: Division): Division[] {
      const result: Division[] = [];
      this.divisions.forEach((division: Division) => {
          if (division.parentId === organization.id) {

          }
      });
      return result;
  };



  /**
   * Осуществляет поиск контактов на сервере в соответствии с условием поиска
   * @returns {Observable<ContactGroup|null>}
   */
  searchContacts(userId?: number): Observable<ContactGroup[]>|null {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    let params = { action: "searchContacts", data: { search: this.searchQuery, sourceAtsId: this.currentAts.id, userId: userId ? userId : 0 }};
    this.searchMode = true;
    this.isInSearchMode = true;
    this.isInFavoritesMode = false;
    this.loading = true;
    this.contacts = [];

    return this.http.post(appConfig.apiUrl, params, options)
      .map((res: Response) => {
        this.loading = false;
        this.contacts = [];
        let body = res.json();
        body.forEach((item: IContactGroup) => {
          let group = new ContactGroup(item);
          this.contacts.push(group);
          console.log(group);
          return group;
        });
      })
      .take(1)
      .catch(this.handleError);
  };





  /**
   * Добавляет контакт в избранные
   * @param contactId {number} - идентификатор контакта
   * @returns {Observable<R>}
   */
  addContactToFavorites (contactId: number, token: string): Observable<Contact> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = {
      action: 'addContactToFavorites',
      data: {
        contactId: contactId,
        token: token
      }
    };
    this.loading = true;

    return this.http.post(appConfig.apiUrl, parameters, options)
      .map((response: Response) => {
        this.loading = false;
        let body = response.json();
        let contact = new Contact(body);
        this.favorites.contacts.push(contact);
        return contact;
      })
      .take(1)
        .finally(() => {
            this.loading = false;
        })
      .catch(this.handleError);
  };


  /**
   * Удаляет контакт из избранных
   * @param contactId
   * @returns {Observable<R>}
   */
  removeContactFromFavorites(contactId: number, token: string): Observable<boolean> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let parameters = {
      action: 'removeContactFromFavorites',
      data: {
        contactId: contactId,
        token: token
      }
    };
    this.loading = true;

    return this.http.post(appConfig.apiUrl, parameters, options)
      .map((response: Response) => {
        this.loading = false;
        let body = response.json();
        if (body === true) {

          this.favorites.contacts.forEach((contact: Contact, index: number, array: Contact[]) => {
            if (contact.id === contactId) {
              array.splice(index, 1);
            }
          });

          if (this.favorites.contacts.length === 0) {
              this.isInFavoritesMode = false;
          }

          return true;
        }
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
        return this.http.post(appConfig.uploadPhotoUrl, formData, options)
            .map((response: Response) => {
                this.loading = false;
                let result = response.json();
                console.log('photo url', result);
                /*
                if (this.session.user) {
                    // Если фото загружено для текущего пользователя - меняем фото
                    if (this.session.user.id === userId) {
                        this.session.user.photo = result;
                    }
                    // Если контакт находится в избранных - меняем фото
                    if (this.session.user.favorites.contacts.length > 0) {
                        this.session.user.favorites.contacts.forEach((contact: Contact, index: number, array: Contact[]) => {
                            if (contact.userId === userId) {
                                contact.photo = result;
                            }
                        });
                    }
                }
                */
                return result;
            })
            .take(1)
            .catch(this.handleError);
    };


  setContactPhotoPosition(contactId: number, top: number, left: number, zoom: number): Observable<IContactPhotoPosition> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let parameters = {
          action: 'setContactPhotoPosition',
          data: {
              contactId: contactId,
              top: top,
              left: left,
              zoom: zoom
          }
      };

      this.loading = true;
      return this.http.post(appConfig.apiUrl, parameters, options)
          .map((response: Response) => {
              let body = response.json();
              return body;
          })
          .take(1)
          .finally(() => { this.loading = false; })
          .catch(this.handleError);
  };




  /**
   *
   * @param contact
   * @returns {boolean}
   */
  isContactInFavorites(contact: Contact): boolean {
    let length = this.favorites.contacts.length;
    for (let i = 0; i < length; i++) {
      if (this.favorites[i].id === contact.id)
        return true;
    }
    return false;
  };



  clearSearch(): void {
      this.searchQuery = '';
      this.isInSearchMode = false;
      if (this.currentDivision !== null) {
          this.fetchContactsByDivisionIdRecursive(this.currentDivision.id, this.currentAts.id, '')
              .subscribe();
      } else {
          this.contacts = [];
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

};
