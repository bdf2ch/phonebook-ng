import { Component, Input } from '@angular/core';
import { ContactGroup } from "../../models/contact-group.model";


@Component({
    selector: 'contact-group',
    templateUrl: './contact-group.component.html',
    styleUrls: ['./contact-group.component.css']
})
export class ContactGroupComponent {
    @Input() group: ContactGroup;

};