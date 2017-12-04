import { Component, EventEmitter, Input, Output, Host, OnInit } from '@angular/core';
import { TabsComponent } from '../tabs.component';


@Component({
    selector: 'tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
    @Input() id: string = '';
    @Input() caption: string | null = null;
    @Input() width: string | null = null;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    public isActive: boolean = false;


    constructor(@Host() private parent: TabsComponent) {
        console.log('parent', this.parent);
    };


    ngOnInit(): void {
        this.parent.registerTab(this);
    };


    select(): void {
        console.log(this.id, 'selected');
        this.onSelect.emit();
    };
}
