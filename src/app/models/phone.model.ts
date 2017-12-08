import { Model } from "./model.model";


export class IPhone {
  id: number;
  contact_id: number;
  ats_id: number;
  code?: string;
  number: string;
  title: string;
};


export class Phone extends Model {
  readonly id: number;
  contactId: number;
  atsId: number;
  code: string | null;
  number: string | null;
  title: string | null;

  constructor(config?: IPhone) {
    super();
    this.id = config ? config.id : 0;
    this.contactId = config ? config.contact_id : 0;
    this.atsId = config ? config.ats_id : 0;
    this.code = config && config.code ? config.code : null;
    this.number = config ? config.number : null;
    this.title = config ? config.title : null;
    /*
    if (config) {
      this.id = config.id;
      this.contactId = config.contact_id;
      this.atsId = config.ats_id;
      this.number = config.number;
    } else {
      this.id = 0;
      this.contactId = 0;
      this.atsId = 0;
      this.number = ''
    }
    this.isChanged = false;
    */
  };
};
