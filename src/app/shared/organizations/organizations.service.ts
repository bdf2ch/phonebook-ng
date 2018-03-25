import { Injectable } from '@angular/core';
import { Division } from "../../models/division.model";


@Injectable()
export class OrganizationsService {
    private organizations: Division[];
    private newOrganization: Division;
    private selectedOrganization: Division | null;


    constructor() {
        this.organizations = [];
        this.selectedOrganization = null;
        this.newOrganization = new Division();
        this.newOrganization.setupBackup(['title']);
    }


    /**
     * Возвращает перечень организаций
     * @returns {Division[]}
     */
    list(): Division[] {
        return this.organizations;
    };


    /**
     * Возвращает / устанавливает выбранную организацию
     * @param {Division | null} organization - Устанавливаемая выбранная организация
     * @returns {Division | null}
     */
    selected(organization?: Division | null): Division | null {
        if (organization) {
            this.selectedOrganization = organization;
        }
        return this.selectedOrganization;
    };


    /**
     * Возвращает новую организацию
     * @returns {Division}
     */
    new(): Division {
        return this.newOrganization;
    };
}