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
    @Input() model: any;

    constructor(@Host() private parent: TypeAheadComponent,
                private renderer: Renderer2,
                private element: ElementRef) {};


    ngAfterContentInit(): void {
        console.log('option after content init');
        if (this.model) {
            const rect = this.parent.inputWrapper.element.nativeElement.getBoundingClientRect();
            //console.log('child', this.parent.input.element.nativeElement.children[0]);
            //this.renderer.setStyle(this.element.nativeElement.children[0], 'width', rect.width - 6 + 'px');
            this.renderer.setStyle(this.element.nativeElement.children[0], 'width', rect.width + 'px');
            this.renderer.setStyle(this.element.nativeElement.children[0], 'height', this.parent.optionHeight !== 0 ? this.parent.optionHeight + 'px' : 'auto')
        }
    };


    select(value: any): void {
        this.parent.select(value);
    };
}
