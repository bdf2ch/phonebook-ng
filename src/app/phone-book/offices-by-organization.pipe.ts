import { Pipe, PipeTransform } from '@angular/core';
import { Office } from "../models/office.model";


@Pipe({
    name: 'officesByOrganization',
    pure: true
})
export class OfficesByOrganizationPipe implements PipeTransform {
    transform(offices: Office[], organizationId: number): Office[] {
        let result: Office[] = [];
        if (organizationId && organizationId !== 0) {
            offices.forEach((office: Office) => {
                if (office.organizationId === organizationId) {
                    result.push(office);
                }
            });
            return result;
        } else {
            return offices;
        }
    }
}