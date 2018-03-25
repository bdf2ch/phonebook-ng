import { Model } from "./model.model";


/**
 * Интерфейс, описывающий модель структурного подразделения в БД
 */
export interface IDivision {
  id: number;                 // Идентификатор структурного подразделения
  parent_id: number;          // Идентификатор структурного подразделения верхнего уровня
  department_id: number;      // Идентификатор производственного отделения
  office_id: number;          // Идентфиикатор офиса организации
  title: string;              // Наименование структурного подразделения
  order: number;              // Порядок следования структурного подразделения
  is_department: boolean;     // Является ли структурное подразделение производственным отделением
}


/**
 * Класс, описывающий модель структурного подразделения
 */
export class Division extends Model {
  readonly id: number;        // Идентификатор структурного подразделения
  parentId: number;           // Идентификатор структурного подразделения верхнего уровня
  departmentId: number;       // Идентификатор производственного отделения
  officeId: number;           // Идентфиикатор офиса организации
  title: string;              // Наименование структурного подразделения
  order: number;              // Порядок следования структурного подразделения
  isDepartment: boolean;      // Является ли структурное подразделение производственным отделением
  isSelected: boolean;        // Выбрано ли струкутрное подразделение
  isOpened: boolean;          // Развернуто ли структурное подразделение
  children: Division[];       // Дочерние структруные подразделения


  /**
   * Конструктор
   * @param {IDivision} config - Параметры инициализации
   */
  constructor (config?: IDivision) {
    super();
    this.id = config ? config.id : 0;
    this.parentId = config ? config.parent_id : 0;
    this.departmentId = config ? config.department_id : 0;
    this.officeId = config ? config.office_id : 0;
    this.title = config ? config.title : '';
    this.order = config ? config.order : 0;
    this.isDepartment = config ? config.is_department : false;
    this.isOpened = false;
    this.isSelected = false;
    this.children = [];
  };
}
