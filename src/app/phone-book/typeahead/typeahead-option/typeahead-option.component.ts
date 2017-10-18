import {
    AfterContentInit, Component, Output, ElementRef, Host, Renderer2, ViewEncapsulation,
    EventEmitter
} from '@angular/core';
import { TypeAheadComponent } from '../typeahead.component';


@Component({
    selector: 'typeahead-option',
    templateUrl: './typeahead-option.component.html',
    styleUrls: ['./typeahead-option.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TypeAheadOptionComponent implements AfterContentInit {
    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    constructor(@Host() private parent: TypeAheadComponent,
                private renderer: Renderer2,
                private element: ElementRef) {};

    ngAfterContentInit(): void {
        const rect = this.parent.input.element.nativeElement.getBoundingClientRect();
        console.log('parent-width', this.parent.input.element.nativeElement.offsetWidth);
        this.renderer.setStyle(this.element.nativeElement.children[0], 'width', rect.width - 6 + 'px');
    };

    select(value: any): void {
        this.onSelect.emit(value);
    };
};
