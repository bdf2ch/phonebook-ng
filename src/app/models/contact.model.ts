import { Model } from "./model.model";
import { IPhone, Phone} from "./phone.model";
import { IUser, User } from './user.model';


export interface IContact {
  id: number;
  user_id?: number;
  organization_id: number;
  office_id: number;
  division_id: number;
  surname: string;
  name: string;
  fname?: string;
  position?: string;
  email?: string;
  mobile?: string;
  photo?: string;
  room: string;
  order_id: number | null;
  is_in_favorites: boolean;
  user?: IUser;
  phones: IPhone[];
}


export class Contact extends Model {
  readonly id: number;
  userId: number;
  organizationId: number;
  divisionId: number;
  officeId: number;
  name: string;
  fname: string;
  surname: string;
  position: string;
  positionTrimmed: string;
  email: string;
  mobile: string;
  photo: string;
  phones: Phone[];
  visiblePhones: Phone[];
  room: string | null;
  order: number;
  isInFavorites: boolean;
  fio: string;
  user: User | null;

  constructor (config?: IContact) {
    super();
    this.id = config && config.id ? config.id : 0;
    this.userId = config && config.user_id ? config.user_id : 0;
    this.organizationId = config && config && config.organization_id ? config.organization_id : 0;
    this.divisionId = config && config.division_id ? config.division_id : 0;
    this.officeId = config && config.office_id ? config.office_id : 0;
    this.name = config && config.name ? config.name : '';
    this.fname = config && config.fname ? config.fname : '';
    this.surname = config && config.surname ? config.surname : '';
    this.position = config && config.position ? config.position : '';
    this.positionTrimmed = this.position.length > 55 ? this.position.substr(0, 55) + '...' : this.position;
    this.email = config && config.email ? config.email : '';
    this.mobile = config && config.mobile ? config.mobile : '';
    this.photo = config && config.photo ? config.photo : '';
    this.phones = [];
    this.visiblePhones = [];
    this.room = config && config.room ? config.room : null;
    this.order = config && config.order_id ? config.order_id : 0;
    this.isInFavorites = config && config.is_in_favorites ? config.is_in_favorites : false;
    this.fio = this.surname + ' ' + this.name + ' ' + this.fname;
    this.user = config && config.user ? new User(config.user) : null;

    if (config && config.phones) {
      config.phones.forEach((item: IPhone, index: number) => {
        const phone = new Phone(item);
        phone.setupBackup(['atsId', 'number', 'title']);
        this.phones.push(phone);
        if (index === 0 || index === 1) {
          this.visiblePhones.push(phone);
        }
      });
    }
  };
}
