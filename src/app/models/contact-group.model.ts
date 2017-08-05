import { Division, IDivision } from "./Division.model";
import { Contact, IContact } from "./contact.model";


/**
 * IContactGroup
 * Интерфейс модели абонента
 */
export interface IContactGroup {
    divisions: IDivision[];
    contacts: IContact[];
};


/**
 * ContactGroup
 * Группа контактов
 */
export class ContactGroup {
    divisions: Division[] = [];
    contacts: Contact[] = [];

    constructor (config?: IContactGroup) {
        if (config) {
            config.divisions.forEach((item: IDivision) => {
                const division = new Division(item);
                this.divisions.push(division);
            });
            config.contacts.forEach((item: IContact) => {
                const contact = new Contact(item);
                this.contacts.push(contact);
            });
        }
    };
};
