import { Component, Input } from '@angular/core';
import { Contact } from "../../models/Contact.model";


@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {
    @Input() private contact: Contact;
};
