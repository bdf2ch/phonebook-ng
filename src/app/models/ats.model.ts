import { Model } from "./model.model";


/**
 * Интерфейс, описывающий модель АТС в БД
 */
export interface IATS {
    id: number;                 // Идентификатор АТС
    parent_id: number;          // Идентификатор АТС верхнего уровня
    type: number;               // Тип АТС
    title: string;              // Наименование АТС
    level: number;              // Уровень вложенности АТС
    is_selectable: boolean;     // Достуана ли АТС для выбора
}


/**
 * Класс, описывающий модель АТС
 */
export class ATS extends Model {
    id: number;                 // Идентификатор АТС
    parentId: number;           // Идентиффикатор АТС верхнего уровня
    type: number;               // Тип АТС
    title: string;              // Наименование АТС
    level: number;              // Уровень вложенности АТС
    isSelectable: boolean;      // Доступна ли АТС для выбора


    /**
     * Конструктор
     * @param {IATS} config - Параметры инициализации
     */
    constructor(config?: IATS) {
        super();
        this.id = config ? config.id : 0;
        this.parentId = config.parent_id ? config.parent_id : 0;
        this.type = config.type ? config.type : 0;
        this.title = config.title ? config.title : '';
        this.level = config.level ? config.level : 0;
        this.isSelectable = config.is_selectable ? config.is_selectable : true;
    };
}
