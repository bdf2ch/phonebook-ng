import { Pipe, PipeTransform } from '@angular/core';
import { Division } from "../../models/Division.model";


@Pipe({
    name: 'divisionOrder'
})
export class DivisionOrderPipe implements PipeTransform {
    transform(value: Division[]): Division[] {
        return value.sort((a: Division, b: Division) => {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return 1;
            if (a.order === b.order) return 0;
        });
    }
};