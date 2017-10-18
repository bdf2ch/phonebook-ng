import {
    AfterContentInit, Component, Output, ElementRef, Host, Renderer2, ViewEncapsulation,
    EventEmitter, Input
} from '@angular/core';
import { TypeAheadComponent } from '../typeahead.component';


@Component({
    selector: 'typeahead-option',
    templateUrl: './typeahead-option.component.html',
    styleUrls: ['./typeahead-option.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TypeAheadOptionComponent implements AfterContentInit {
    //@Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Input() model: any;

    constructor(@Host() private parent: TypeAheadComponent,
                private renderer: Renderer2,
                private element: ElementRef) {};


    ngAfterContentInit(): void {
        const rect = this.parent.input.element.nativeElement.getBoundingClientRect();
        //console.log('child', this.parent.input.element.nativeElement.children[0]);
        //this.renderer.setStyle(this.element.nativeElement.children[0], 'width', rect.width - 6 + 'px');
        this.renderer.setStyle(this.element.nativeElement, 'width', rect.width - 6 + 'px');
    };


    select(value: any): void {
        //this.onSelect.emit(value);
        this.parent.select(value);
    };
}
