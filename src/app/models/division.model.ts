import { Model } from "./model.model";


export interface IDivision {
  id: number;
  parent_id: number;
  department_id: number;
  office_id: number;
  title: string;
  order: number;
  is_department?: boolean;
};


export class Division extends Model {
  readonly id: number = 0;
  parentId: number = 0;
  departmentId: number = 0;
  officeId: number;
  title: string = "";
  order: number = 0;
  isDepartment: boolean = false;
  isSelected: boolean = false;
  isOpened: boolean = false;
  //isLast: boolean = false;
  children: Division[] = [];

  constructor (config?: IDivision) {
    super();
    this.officeId = config ? config.office_id : 0;
    if (config) {
      this.id = config.id;
      this.parentId = config.parent_id;
      this.departmentId = config.department_id !== undefined ? config.department_id : 0;
      this.title = config.title;
      this.order = config.order ? config.order : 0;
      this.isDepartment = config.is_department !== undefined ? config.is_department : false;
    }
  };

};
