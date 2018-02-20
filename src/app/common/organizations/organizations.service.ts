import { Injectable } from '@angular/core';
import { Division } from "../../models/division.model";


@Injectable()
export class OrganizationsService {
    private organizations: Division[];
    public selected: Division | null;


    constructor() {
        this.organizations = [];
        this.selected = null;
    }


    /**
     * Возвращает перечень организаций
     * @returns {Division[]}
     */
    list(): Division[] {
        return this.organizations;
    };
}