import { Model } from "./model.model";
import { Phone } from "./phone.model";

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
      this.positionTrimmed = this.position.length > 50 ? this.position.substr(0, 50) + '...' : this.position;
      this.email = config.email ? config.email : '';
      this.mobile = config.mobile ? config.mobile : '';
      this.photo = config.photo ? config.photo : '';
      this.isInFavorites = config.is_in_favorites;
      this.fio = this.surname + ' ' + this.name + ' ' + this.fname;
      //this.search = this.fio.toLowerCase();
    }
  };
};
