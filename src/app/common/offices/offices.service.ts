import { Injectable } from '@angular/core';
import { Office } from "../../models/office.model";
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { appConfig } from "../../app.config";


@Injectable()
export class OfficesService {
    private url = 'http://10.50.0.153:4444/phonebook/offices';
    private offices: Office[];
    public selected: Office | null;
    public new: Office;
    public addingOfficeIsInProgress: boolean;
    public editingOfficeIsInProgress: boolean;
    public deletingOfficeIsInProgress: boolean;


    /**
     * Конструктор
     * @param {Http} http
     */
    constructor (private http: Http) {
        this.offices = [];
        this.selected = null;
        this.new = new Office();
        this.new.organizationId = appConfig.defaultOrganizationId;
        this.addingOfficeIsInProgress = false;
        this.editingOfficeIsInProgress = false;
        this.deletingOfficeIsInProgress = false;
    }


    /**
     * Возвращает перечень офисов организаций
     * @returns {Office[]}
     */
    list(): Office[] {
        return this.offices;
    };


    /**
     * Поиск офиса организации по идентификатору
     * @param {number} officeId - Идентификатор офиса организации
     * @returns {Office | null}
     */
    getById(officeId: number): Office | null {
        const findOfficeById = (office: Office) => office.id === officeId;
        let result = this.offices.find(findOfficeById);
        return result ? result : null;
    };


    /**
     * Добавление нового офиса организации
     * @param {Office} office - Добавляемый офис
     * @returns {Observable<Office | boolean>}
     */
    add(office: Office, token: string): Observable<Office|boolean> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        let parameters = {
            action: 'add',
            data: {
                organizationId: office.organizationId,
                address: office.address,
                city: office.city,
                token: token
            }
        };

        this.addingOfficeIsInProgress = true;
        return this.http.post(this.url, parameters, options)
            .map((response: Response) => {
                let answer = response.json();
                if (answer.error !== null) {
                    console.error(answer.error);
                    return false;
                } else {
                    let newlyAddedOffice = new Office(answer.result);
                    newlyAddedOffice.setupBackup(['organizationId', 'address', 'city']);
                    this.offices.push(newlyAddedOffice);
                    return newlyAddedOffice;
                }
            })
            .take(1)
            .finally(() => { this.addingOfficeIsInProgress = false; })
            .catch(this.handleError);
    };


    /**
     * Изменение офиса организации
     * @param {Office} office
     * @returns {Observable<boolean>}
     */
    edit(office: Office, token: string): Observable<boolean> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        let parameters = {
            action: 'edit',
            data: {
                officeId: office.id,
                organizationId: office.organizationId,
                address: office.address,
                city: office.city,
                token: token
            }
        };

        this.editingOfficeIsInProgress = true;
        return this.http.post(this.url, parameters, options)
            .map((response: Response) => {
                let answer = response.json();
                if (answer.error !== null) {
                    console.error(answer.error);
                    return false;
                } else {
                    office.setupBackup(['organizationId', 'address', 'city']);
                    return true;
                }
            })
            .take(1)
            .finally(() => { this.editingOfficeIsInProgress = false; })
            .catch(this.handleError);
    };


    /**
     * Удаление офиса организации
     * @param {number} officeId - Идентификатор офиса организации
     * @returns {Observable<boolean>}
     */
    delete(office: Office, token: string): Observable<boolean> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });
        let parameters = {
            action: 'delete',
            data: {
                officeId: office.id,
                token: token
            }
        };

        this.deletingOfficeIsInProgress = true;
        return this.http.post(this.url, parameters, options)
            .map((response: Response) => {
                let answer = response.json();
                if (answer.error !== null) {
                    console.error(answer.error);
                    return false;
                } else {
                    this.offices.forEach((off: Office, index: number, offices: Office[])=> {
                       if (off.id === office.id) {
                           offices.splice(index, 1);
                       }
                    });
                    return true;
                }
            })
            .take(1)
            .finally(() => { this.deletingOfficeIsInProgress = false; })
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