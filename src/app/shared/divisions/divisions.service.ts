import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Division } from "../../models/division.model";
import { Observable } from "rxjs/Observable";
import {Office} from "../../models/office.model";
import { appConfig } from '../../app.config';


@Injectable()
export class DivisionsService {
    private url = 'http://10.50.0.153:4444/phonebook/divisions';
    private divisions: Division[];
    private selectedDivision: Division | null;
    private newDivision: Division;
    public isAdding: boolean;
    public isEditing: boolean;
    public isDeleting: boolean;


    constructor(private http :Http) {
        this.divisions = [];
        //this.selected = null;
        this.selectedDivision = null;
        //this.new = new Division();
        //this.new.parentId = appConfig.defaultOrganizationId;
        //this.new.setupBackup(['parentId', 'title']);
        this.newDivision = new Division();
        this.newDivision.parentId = appConfig.defaultOrganizationId;
        this.newDivision.setupBackup(['parentId', 'title']);
        this.isAdding = false;
        this.isEditing = false;
        this.isDeleting = false;
    };


    /**
     * Возвращает перечень структурных подразделений
     * @returns {Division[]}
     */
    list(): Division[] {
        return this.divisions;
    };


    /**
     * Возвращает / устанавливает выбранное структурное подразделение
     * @param {Division | null} division - Устанавливаемое выбранное структурное подразделение
     * @returns {Division | null}
     */
    selected(division?: Division | null): Division | null {
        if (division) {
            this.selectedDivision = division;
        }
        return this.selectedDivision;
    };


    /**
     * Возвращает новое тсруктурное подразделение
     * @returns {Division}
     */
    new(): Division {
        return this.newDivision;
    };


    /**
     * Поиск структурного подразделения по идентификатору
     * @param {number} divisionId - Идентификатор структурного подразделения
     * @returns {Division | null}
     */
    getById(divisionId: number): Division | null {
        const findDivisionById = (division: Division) => division.id === divisionId;
        let division = this.divisions.find(findDivisionById);
        return division ? division : null;
    };


    /**
     * Добавление структурного подразделения
     * @param {Division} division - Добавляемое структурное подразделение
     * @param {String} token - Токен сессии пользователя
     * @returns {Observable<Division | boolean>}
     */
    add(division: Division, token: string): Observable<Division | boolean> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let parameters = {
            action: 'add',
            data: {
                parentId: division.parentId,
                title: division.title,
                token: token
            }
        };

        this.isAdding = true;
        return this.http.post(this.url, parameters, options)
            .map((response: Response) => {
                let answer = response.json();
                if (answer.error !== null) {
                    console.error(answer.error);
                    return false;
                } else {
                    let newlyAddedDivision = new Division(answer.result);
                    newlyAddedDivision.setupBackup(['parentId', 'title']);
                    console.info('id структурного подразделения: ', newlyAddedDivision.id);
                    this.divisions.push(newlyAddedDivision);
                    return newlyAddedDivision;
                }
            })
            .take(1)
            .finally(() => { this.isAdding = false; })
            .catch(this.handleError);
    };


    /**
     * Изменение структурного подразделения
     * @param {Division} division - Изменеямое структурное подразделение
     * @param {String} token - Токен сессии пользователя
     * @returns {Observable<boolean>}
     */
    edit(division: Division, token: string): Observable<boolean> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let parameters = {
            action: 'edit',
            data: {
                divisionId: division.id,
                parentId: division.parentId,
                title: division.title,
                token: token
            }
        };

        this.isEditing = true;
        return this.http.post(this.url, parameters, options)
            .map((response: Response) => {
                let answer = response.json();
                if (answer.error !== null) {
                    console.error(answer.error);
                    return false;
                } else {
                    division.setupBackup(['parentId', 'title']);
                    return true;
                }
            })
            .take(1)
            .finally(() => { this.isEditing = false; })
            .catch(this.handleError);
    };


    /**
     * Удаление структурного подразделения
     * @param {number} divisionId - Идентификатор структурного подразделения
     * @param {string} token - Токен сессии пользователя
     * @returns {Observable<boolean>}
     */
    delete(divisionId: number, token: string): Observable<boolean> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let parameters = {
            action: 'delete',
            data: {
                divisionId: divisionId,
                token: token
            }
        };

        this.isDeleting = true;
        return this.http.post(this.url, parameters, options)
            .map((response: Response) => {
                let answer = response.json();
                if (answer.error !== null) {
                    console.error(answer.error);
                    return false;
                } else {
                    this.divisions.forEach((division: Division, index: number, divisions: Division[]) => {
                        if (division.id === divisionId) {
                            divisions.splice(index, 1);
                        }
                    });
                    return true;
                }
            })
            .take(1)
            .finally(() => { this.isDeleting = false; })
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