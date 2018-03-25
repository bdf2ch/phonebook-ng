import { Model } from "./model.model";


/**
 * Интерфейс, описывающий модель офиса организации в БД
 */
export interface IOffice {
    id: number;                     // Идентификатор офиса
    organization_id: number;        // Идентификатор организации
    address: string | null;         // Адрес офиса
    city: string | null;            // Населенный пункт
}


/**
 * Класс, описывабщий офис организации
 */
export class Office extends Model {
    id: number;                     // Идентификатор офиса
    organizationId: number;         // Идентификатор организации
    address: string | null;         // Адрес офиса
    city: string | null;            // Населенный пункт


    /**
     * Конструктор
     * @param {IOffice} config - Параметры инициализации
     */
    constructor(config?: IOffice) {
        super();
        this.id = config ? config.id : 0;
        this.organizationId = config ? config.organization_id : 0;
        this.address = config ? config.address : null;
        this.city = config ? config.city : null;
    };
}