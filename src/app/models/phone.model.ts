import { Model } from "./model.model";


/**
 * Интерфейс, описывающтй модель телефонного номера в БД
 */
export class IPhone {
  id: number;                 // Идентификатор телефонного номера
  contact_id: number;         // Идентификатор абонента
  ats_id: number;             // Идентификатор АТС
  code?: string;              // Код выхода на АТС
  number: string;             // Номер телефона
  title: string;              // Номер телефона с кодом выхода на АТС
}


/**
 * Класс, описывающий модель телефонного номера
 */
export class Phone extends Model {
  readonly id: number;        // Идентификатор телефонного номера
  contactId: number;          // Идентификатор абонента
  atsId: number;              // Идентификатор АТС
  code: string | null;        // Код выхода на АТС
  number: string | null;      // Номер телефона
  title: string | null;       // Номер телефона с кодом выхода на АТС


  /**
   * Конструктор
   * @param {IPhone} config - Параметры инициализации
   */
  constructor(config?: IPhone) {
    super();
    this.id = config ? config.id : 0;
    this.contactId = config ? config.contact_id : 0;
    this.atsId = config ? config.ats_id : 0;
    this.code = config && config.code ? config.code : null;
    this.number = config ? config.number : null;
    this.title = config ? config.title : null;
  };
}
