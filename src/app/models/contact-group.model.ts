import { Division, IDivision } from "./division.model";
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
                contact.setupBackup(['userId', 'surname', 'name', 'fname', 'position', 'positionTrimmed', 'email', 'mobile']);
                this.contacts.push(contact);
            });
        }
    };


    /**
     * Удаление абонента
     * @param contact {Contact} - удаляемый контакт
     */
    removeContact(contact: Contact): void {
        this.contacts.forEach((item: Contact, index: number, array: Contact[]) => {
            if (item.id === contact.id) {
                array.splice(index, 1);
            }
        });
    };
};
