import { Pipe, PipeTransform } from '@angular/core';
import { Division } from '../../models/division.model';


@Pipe({name: 'exceptSelectedOrganization'})
export class ExceptSelectedOrganizationPipe implements PipeTransform {
    transform(value: Division[], organizationId: number): Division[] {
        const result: Division[] = [];
        value.forEach((division: Division, index: number, array: Division[]) => {
            if (division.id !== organizationId) {
                result.push(division)
            }
        });
        return result;
    }
}
