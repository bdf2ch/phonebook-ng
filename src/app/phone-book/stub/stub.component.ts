import { Component, Input } from '@angular/core';


@Component({
    selector: 'stub',
    templateUrl: './stub.component.html',
    styleUrls: ['./stub.component.css']
})
export class StubComponent {
    @Input() icon: string;
    @Input() text: string;
};