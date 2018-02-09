import { Component } from '@angular/core';


@Component({
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.css']
})
export class HelpComponent {
    private container: any;

    constructor() {
        this.container = document.getElementById('help-content');
    };

    scrollTo(id: string): void {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView();
        }
    };
}
