import { Contact } from './contact.model';
import { ContactGroup } from './contact-group.model';


export interface  IDraggableContact {
    contact: Contact,
    group: ContactGroup
};