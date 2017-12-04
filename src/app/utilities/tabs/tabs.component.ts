import { Component, Input, OnInit } from '@angular/core';
import { TabsService } from './tabs.service';
import { TabComponent } from './tab/tab.component';


@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
    @Input() id: string = '';
    private tabs: TabComponent[] = [];

    constructor(private tabsService: TabsService) {};

    ngOnInit(): void {
        this.tabsService.register(this);
    };

    registerTab(tab: TabComponent): TabComponent {
        this.tabs.push(tab);
        this.tabs[0].isActive = true;
        console.log('tab registered', tab);
        return tab;
    };


    selectTab(tab: TabComponent): void {
        this.tabs.forEach((item: TabComponent, index: number, array: TabComponent[]) => {
            if (item.id === tab.id) {
                item.isActive = true;
                item.select();
            } else {
                item.isActive = false;
            }
        });
    };
}