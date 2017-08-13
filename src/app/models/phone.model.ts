import { Model } from "./model.model";


export class IPhone {
  id: number;
  contact_id: number;
  ats_id: number;
  number: string;
};


export class Phone extends Model {
  readonly id: number;
  contactId: number;
  atsId: number;
  number: string;
  isChanged: boolean;

  constructor(config?: IPhone) {
    super();
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
  };
};
