import { Model } from './model.model';
import { Permission } from "./permission.model";


/**
 * Интерфейс, описывающтй модель пользователя в БД
 */
export interface IUser {
  readonly id: number;
  tab_id?: string;
  department_id?: number;
  division_id?: number;
  office_id: number;
  name: string;
  fname?: string;
  surname: string;
  position?: string;
  email?: string;
  photo?: string;
  room: string;
  active_directory_account?: string;
  is_administrator?: boolean;
}


export class User extends Model {
  readonly id: number = 0;
  tabId: string = "";
  departmentId: number = 0;
  divisionId: number = 0;
  officeId: number;
  surname: string = "";
  name: string = "";
  fname: string = "";
  position: string = "";
  email: string = "";
  photo: string | null = null;
  room: string | null;
  activeDirectoryAccount: string = "";
  isAdministrator: boolean = false;
  permissions: Permission[] = [];
  fio: string = "";


  constructor (config?: IUser) {
    super();
    if (config) {
      this.id = config.id;
      this.tabId = config.tab_id !== undefined ? config.tab_id : '';
      this.departmentId = config.department_id !== undefined ? config.department_id : 0;
      this.divisionId = config.division_id !== undefined ? config.division_id : 0;
      this.officeId = config.office_id ? config.office_id : 0;
      this.surname = config.surname;
      this.name = config.name;
      this.fname = config.fname !== undefined ? config.fname : '';
      this.position = config.position !== undefined ? config.position : '';
      this.email = config.email !== undefined ? config.email : '';
      this.photo = config.photo !== null ? config.photo : null;
      this.room = config.room ? config.room : null;
      this.activeDirectoryAccount = config.active_directory_account !== undefined ? config.active_directory_account : '';
      //this.isAdministrator = config.is_administrator !== undefined ? config.is_administrator : false;
    }
    this.fio = this.fname !== '' ? this.surname + " " + this.name + " " + this.fname : this.surname + ' ' + this.name;
  };


  getPermissionByCode(code: string): Permission | null {
    const findPermissionByCode = (permission: Permission) => permission.code === code;
    const permission = this.permissions.find(findPermissionByCode);
    console.log('permission', permission);
    return permission ? permission : null;
  };
}
