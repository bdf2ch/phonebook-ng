import { Model } from './model.model';


/**
 * Интерфейс, описывающий модель мобильного телефонного номера в БД
 */
export  interface  IMobilePhone {
    id: number;                 // Идентификатор мобильного телефонного номера
    contact_id: number;         // Идентификатор абонента
    number: string;             // Номер мобильного телефона
}


/**
 * Класс, описывающий модель мобильного телефонного номера
 */
export class MobilePhone extends Model {
    id: number;                 // Идентификатор мобильного телефонного номера
    contactId: number;          // Идентификатор абонента
    number: string;             // Номер мобильного телефона


    /**
     * Конструктор
     * @param {IMobilePhone} config - Параметры инициализации
     */
    constructor(config?: IMobilePhone) {
        super();
        this.id = config ? config.id : 0;
        this.contactId = config.contact_id ? config.contact_id : 0;
        this.number = config ? config.number : '';
    };
}