import { Component, Input } from '@angular/core';
import { Division } from '../../models/Division.model';
import { Contact } from '../../models/Contact.model';


@Component({
    selector: 'contact-group',
    templateUrl: './contact-group.component.html',
    styleUrls: ['./contact-group.component.css']
})
export class ContactGroupComponent {
    @Input() divisions: Division[] = [];
    @Input() contacts: Contact[] = [];
};