import {
    Component, EventEmitter, Input, Output, ElementRef, ViewChild, ViewContainerRef, AfterViewInit, Renderer2,
    AfterContentInit, AfterContentChecked, HostBinding, OnInit, NgZone, HostListener, ViewEncapsulation, OnChanges,
    SimpleChanges
} from '@angular/core';


@Component({
    selector: 'typeahead',
    templateUrl: './typeahead.component.html',
    styleUrls: ['./typeahead.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TypeAheadComponent implements AfterContentInit, OnInit, OnChanges {
    @Input() options: any[] = [];
    @Input() placeholder: string = '';
    @Input() loading: boolean = false;
    @Input() limit: number = 10;
    @Input() optionHeight: number = 0;
    @Input() selectedOptionText: string = '';
    @Output() onChange: EventEmitter<string> = new EventEmitter();
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Output() onReset: EventEmitter<any> = new EventEmitter();
    @ViewChild('input', { read: ViewContainerRef }) public input: ViewContainerRef;
    @ViewChild('inputWrapper', { read: ViewContainerRef }) public inputWrapper: ViewContainerRef;
    @ViewChild('optionsWrapper', { read: ViewContainerRef }) public optionsWrapper: ViewContainerRef;
    private selectedOption: any | null = null;

    constructor(private element: ElementRef,
                private renderer: Renderer2,
                private zone: NgZone) {};


    ngOnInit(): void {
        console.log('typeahead onInit');
        this.input.element.nativeElement.value = '';
    };


    ngAfterContentInit(): void {
        //console.log('child', this.parent.input.element.nativeElement.children[0]);
        if (this.options.length > 0) {
            console.log('afterContentInit');
            const rect = this.inputWrapper.element.nativeElement.getBoundingClientRect();
            this.renderer.setStyle(this.optionsWrapper.element.nativeElement.children[0], 'width', rect.width + 'px');
            if (this.optionHeight > 0) {
                console.log('optionswrapper', this.optionsWrapper.element.nativeElement);
                this.renderer.setStyle(this.optionsWrapper.element.nativeElement, 'max-height', this.optionHeight * this.limit + 'px');
            }
        }
    };

    ngOnChanges(changes: SimpleChanges): void {
        //if (changes['optionHeight']['currentValue'] && changes['limit']['currentValue']) {
        //    console.log('optionswrapper', this.optionsWrapper.element.nativeElement);
        //    this.renderer.setStyle(this.optionsWrapper.element.nativeElement, 'max-height', this.optionHeight * this.limit + 'px');
       // }
    };


    /**
     * Реакция на ввод текста в поле ввода пользователем
     * @param text {string} - введенный текст
     */
    change(text: any): void {
        if (text.length > 0) {
            this.onChange.emit(text);
        }
    };



    select(value: any): void {
        console.log('selected value', value);
        this.selectedOption = value;
        if (this.selectedOptionText && this.selectedOption[this.selectedOptionText]) {
            this.input.element.nativeElement.value = this.selectedOption[this.selectedOptionText];
        }
        this.onSelect.emit(value);
    };


    reset(): void {
        this.input.element.nativeElement.value = '';
        this.selectedOption = null;
        this.onReset.emit();
    };

}