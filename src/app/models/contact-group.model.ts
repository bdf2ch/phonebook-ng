import { Division, IDivision } from "./division.model";
import { Contact, IContact } from "./contact.model";


/**
 * IContactGroup
 * Интерфейс, описывающий модель группы абонентов, полученную с сервера
 */
export interface IContactGroup {
    divisions: IDivision[];         // Полный путь из структурных подразделений к группе абонентов
    contacts: IContact[];           // Абоненты, входящие в группу
}


/**
 * ContactGroup
 * Класс, описывающий модель группы абонентов
 */
export class ContactGroup {
    divisions: Division[];          // Полный путь из структурных подразделений к группе абонентов
    contacts: Contact[];            // Абоненты, входящие в группу


    /**
     * Конструктор
     * @param {IContactGroup} config - Параметры инициализации
     */
    constructor (config?: IContactGroup) {
        this.divisions = [];
        this.contacts = [];

        if (config) {
            config.divisions.forEach((item: IDivision) => {
                const division = new Division(item);
                this.divisions.push(division);
            });
            config.contacts.forEach((item: IContact) => {
                const contact = new Contact(item);
                contact.setupBackup(['userId', 'surname', 'name', 'fname', 'position', 'positionTrimmed', 'email', 'mobile', 'room', 'order']);
                this.contacts.push(contact);
            });
        }
    };


    /**
     * Удаление абонента
     * @param contact {Contact} - Удаляемый абонентк
     */
    removeContact(contact: Contact): void {
        this.contacts.forEach((item: Contact, index: number, array: Contact[]) => {
            if (item.id === contact.id) {
                array.splice(index, 1);
            }
        });
    };


    /**
     * Удаление всех абонентов группы
     */
    clearContacts(): void {
        this.contacts = [];
    };
}
