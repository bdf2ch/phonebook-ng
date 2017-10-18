import {
    Component, EventEmitter, Input, Output, ElementRef, ViewChild, ViewContainerRef, AfterViewInit, Renderer2,
    AfterContentInit, AfterContentChecked, HostBinding, OnInit, NgZone, HostListener, ViewEncapsulation
} from '@angular/core';


@Component({
    selector: 'typeahead',
    templateUrl: './typeahead.component.html',
    styleUrls: ['./typeahead.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TypeAheadComponent implements AfterViewInit {
    @Input() options: any[] = [];
    @Output() onChange: EventEmitter<string> = new EventEmitter();
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @ViewChild('input', { read: ViewContainerRef }) public input: ViewContainerRef;
    @ViewChild('optionsContainer', { read: ViewContainerRef }) public optionsContainer: ViewContainerRef;
    private isOptionsShowed: boolean = true;

    constructor(private element: ElementRef,
                private renderer: Renderer2,
                private zone: NgZone) {};


    ngAfterViewInit(): void {
        const rect = this.input.element.nativeElement.getBoundingClientRect();
        //console.log('child', this.parent.input.element.nativeElement.children[0]);
        this.renderer.setStyle(this.optionsContainer.element.nativeElement.children[0], 'width', rect.width + 'px');
    };


    select(value: any): void {
        console.log('selected value', value);
        this.onSelect.emit(value);
    };

}