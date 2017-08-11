import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from "../../models/contact.model";


@Pipe({
    name: 'contactsOrder'
})
export class ContactsOrderPipe implements PipeTransform {
    transform(value: Contact[], param?: string): Contact[] {
        if (param) {
            let result: Contact[] = [];
            switch (param) {
                case 'order':
                    result =  value.sort((a: Contact, b: Contact) => {
                        if (a.order < b.order) return -1;
                        if (a.order > b.order) return 1;
                        if (a.order === b.order) return 0;
                    });
                    break;
                case 'fio':
                    result =  value.sort((a: Contact, b: Contact) => {
                        if (a.fio < b.fio) return -1;
                        if (a.fio > b.fio) return 1;
                        if (a.fio === b.fio) return 0;
                    });
                    break;
            }
            return result;
        } else
            return value;
    }
};