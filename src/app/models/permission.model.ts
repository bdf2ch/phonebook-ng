/**
 * Интерфейс, описывающтй правило доступа пользователя в БД
 */
export interface IPermission {
    id: number;                 // Идентификатор правила
    user_id: number;            // Идентификатор пользователя
    code: string;               // Код правила доступа
    title: string;              // Наименование правила доступа
    enabled: boolean;           // Действует ли правило доступа
}


/**
 * Класс, описывабщий модель правила доступа пользователя
 */
export class Permission {
    id: number;                 // Идентификатор правила
    userId: number;             // Идентификатор пользователя
    code: string;               // Код правила доступа
    title: string;              // Наименование правила доступа
    enabled: boolean;           // Действует ли правило доступа


    /**
     * Конструктор
     * @param {IPermission} config - Параметры инициализации
     */
    constructor(config?: IPermission) {
        this.id = config ? config.id : 0;
        this.userId = config ? config.user_id : 0;
        this.code = config ? config.code : '';
        this.title = config ? config.title : '';
        this.enabled = config ? config.enabled : false;
    };
}
