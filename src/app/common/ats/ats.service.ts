import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ATS } from '../../models/ats.model';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AtsService {
    public inner: ATS[];
    public outer: ATS[];
    public selected: ATS | null;
    public new: ATS;
    public isAdding: boolean;
    public isEditing: boolean;
    public isDeleting: boolean;


    constructor(private http: Http) {
        this.inner = [];
        this.outer = [];
        this.selected = null;
        this.new = new ATS();
        this.isAdding = false;
        this.isEditing = false;
        this.isDeleting = false;
    };

    
    /**
     * Добавление новой АТС
     * @param {ATS} ats - Добавляемая АТС
     * @param {string} token - Токен сессии пользователя
     * @returns {Observable<ATS | null>}
     */
    add(ats: ATS, token: string): Observable<ATS | null> {
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({ headers: headers });
        const parameters = {
            action: 'add',
            data: {
                parentId: ats.parentId,
                type: ats.type,
                title: ats.title,
                token: token
            }
        };

        this.isAdding = true;
        return this.http.post('http://10.50.0.053:4444/phonebook/ats', parameters, options)
            .map((res: Response) => {
                const body = res.json();
                let ats = new ATS(body);
                ats.setupBackup(['parentId', 'type', 'title']);
                switch (ats.type) {
                    case 1: this.inner.push(ats); break;
                    case 2: this.outer.push(ats); break;
                }
                return ats;
            })
            .take(1)
            .finally(() => {this.isAdding = false; })
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