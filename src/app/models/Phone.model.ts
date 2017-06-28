import { Model } from "./Model.class";


export class PhoneConfig {
  id: number;
  contact_id: number;
  ats_id: number;
  number: string;
};


export class Phone extends Model {
  readonly id: number = 0;
  contactId: number = 0;
  atsId: number = 0;
  number: string = '';

  constructor(config?: PhoneConfig) {
    super();
    if (config) {
      this.id = config.id;
      this.contactId = config.contact_id;
      this.atsId = config.ats_id;
      this.number = config.number;
    }
  };
};
