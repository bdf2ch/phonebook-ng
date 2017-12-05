import { Model } from "./model.model";
import { IPhone, Phone} from "./phone.model";
import { IContactPhotoPosition } from './user-photo-position.interface';
import { IUser, User } from './user.model';

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
  user?: IUser;
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
  visiblePhones: Phone[] = [];
  mobile: string;
  photo: string ;
  photoTop: number = 0;
  photoLeft: number = 0;
  photoZoom: number = 100;
  order: number = 0;
  isInFavorites: boolean = false;
  fio: string = "";
  search: string = "";
  user: User | null = null;

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
      this.photoTop = config.photo_position ? config.photo_position.photo_top : 0;
      this.photoLeft = config.photo_position ? config.photo_position.photo_left : 0;
      this.photoZoom = config.photo_position ? config.photo_position.photo_zoom : 100;
      this.isInFavorites = config.is_in_favorites;
      this.fio = this.surname + ' ' + this.name + ' ' + this.fname;
      //this.search = this.fio.toLowerCase();

      /**
       * Если есть информация о пользователе, к которому привязан абонент - собираем объект пользователя
       */
      if (config.user) {
        this.user = new User(config.user);
      }

      if (config.phones && config.phones.length > 0) {
        config.phones.forEach((item: IPhone, index: number, array: IPhone[]) => {
          const phone = new Phone(item);
          phone.setupBackup(['atsId', 'number']);
          this.phones.push(phone);
          if (index === 0 || index === 1) {
            this.visiblePhones.push(phone);
          }
        });
      }
    }
  };



  setPhotoPosition(position: IContactPhotoPosition): void {
    console.log('canceled position', position);
    this.photoLeft = position.photo_left;
    this.photoTop = position.photo_top;
    this.photoZoom = position.photo_zoom;
  };
};
