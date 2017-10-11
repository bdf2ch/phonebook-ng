import { Model } from "./model.model";
import { IPhone, Phone} from "./phone.model";
import { IContactPhotoPosition } from './user-photo-position.interface';

export interface IContact {
  id: number;
  user_id?: number;
  division_id: number;
  surname: string;
  name: string;
  fname?: string;
  position?: string;
  email?: string;
  mobile?: string;
  photo?: string;
  is_in_favorites: boolean;
  photo_position?: IContactPhotoPosition,
  phones: IPhone[]
};


export class Contact extends Model {
  readonly id: number = 0;
  userId: number = 0;
  divisionId: number = 0;
  surname: string = "";
  name: string = "";
  fname: string;
  position: string;
  positionTrimmed: string;
  email: string;
  phones: Phone[] = [];
  mobile: string;
  photo: string ;
  photoTop: string = '';
  photoLeft: string = '';
  photoZoom: string = '';
  order: number = 0;
  isInFavorites: boolean = false;
  fio: string = "";
  search: string = "";

  constructor (config?: IContact) {
    super();
    if (config) {
      this.id = config.id;
      this.userId = config.user_id;
      this.divisionId = config.division_id;
      this.surname = config.surname;
      this.name = config.name;
      this.fname = config.fname ? config.fname : '';
      this.position = config.position ? config.position : '';
      this.positionTrimmed = this.position.length > 55 ? this.position.substr(0, 55) + '...' : this.position;
      this.email = config.email ? config.email : '';
      this.mobile = config.mobile ? config.mobile : '';
      this.photo = config.photo ? config.photo : '';
      this.photoTop = config.photo_position ? config.photo_position.top + 'px' : '0px';
      this.photoLeft = config.photo_position ? config.photo_position.left + 'px' : '0px';
      this.photoZoom = config.photo_position ? config.photo_position.zoom + '%' : '100% !important';
      this.isInFavorites = config.is_in_favorites;
      this.fio = this.surname + ' ' + this.name + ' ' + this.fname;
      //this.search = this.fio.toLowerCase();

      if (config.phones && config.phones.length > 0) {
        config.phones.forEach((item: IPhone, index: number, array: IPhone[]) => {
          const phone = new Phone(item);
          phone.setupBackup(['atsId', 'number']);
          this.phones.push(phone);
        });
      }
    }
  };
};
