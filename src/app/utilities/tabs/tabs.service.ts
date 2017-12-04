import { Injectable } from '@angular/core';
import { TabsComponent } from './tabs.component';


@Injectable()
export class TabsService {
    private tabs: TabsComponent[] = [];


    register(tabs: TabsComponent): void {
        this.tabs.push(tabs);
        console.log('tabs registered', this.tabs);
    };


    getById(id: string): TabsComponent | null {
        const findTabsById = (tabs: TabsComponent) => tabs.id === id;
        const tabs = this.tabs.find(findTabsById);
        return tabs? tabs : null;
    };
}