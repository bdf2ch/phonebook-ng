import {
    Component, Input, Output, ViewChild, ViewContainerRef, Renderer2, AfterViewInit, OnDestroy, EventEmitter,
    AfterViewChecked, NgZone, ChangeDetectorRef
} from '@angular/core';
import { IContactPhotoPosition } from '../../models/user-photo-position.interface';


@Component({
    selector: 'photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    @Input() url: string | null = null;
    @Input() blankUrl: string | null = 'http://10.50.4.7:4444/assets/images/users/no_photo.png';
    @Input() height: number = 0;
    @Input() width: number = 0;
    @Input() frameWidth: number = 0;
    @Input() frameHeight: number = 0;
    @Input() frameTop: number = 0;
    @Input() frameLeft: number = 0;
    @Input() zoom: number = 100;
    @Output() onSaveChanges: EventEmitter<IContactPhotoPosition> = new EventEmitter();
    @Output() onCancelChanges: EventEmitter<IContactPhotoPosition> = new EventEmitter();
    @ViewChild('clipper', { read: ViewContainerRef }) clipper: ViewContainerRef;
    @ViewChild('wrapper', { read: ViewContainerRef }) wrapper: ViewContainerRef;
    @ViewChild('controls', { read: ViewContainerRef }) controls: ViewContainerRef;
    private isMouseButtonPressed: boolean = false;
    private isPositionChanged: boolean = false;
    startX: number = 0;
    startY: number = 0;
    x: number = 0;
    y: number = 0;
    clipperTop: number = 0;
    clipperLeft: number = 0;
    private topBorderWidth: number = 0;
    private leftBorderWidth: number = 0;
    private controlsHeight: number = 0;
    private ratio: number = 0;
    private photoZoom: number = 0;



    constructor(private zone: NgZone,
                private detector: ChangeDetectorRef,
                private renderer: Renderer2) {};



    ngAfterViewInit(): void {
        this.ratio = this.width / this.frameWidth;
        this.photoZoom = this.zoom / this.ratio;
        this.detector.detectChanges();
        console.log('ratio = ', this.ratio);
        /* Находим высоту блока с элементами управления */
        this.controlsHeight = this.controls.element.nativeElement.clientHeight;

        /**
         * Рассчитываем и задаем толщину границ рамки
         */
        this.leftBorderWidth = this.width - this.frameWidth;
        this.topBorderWidth =  this.height - this.frameHeight;
        this.renderer.setStyle(this.clipper.element.nativeElement, 'border-left-width', this.leftBorderWidth + 'px');
        this.renderer.setStyle(this.clipper.element.nativeElement, 'border-right-width', this.leftBorderWidth + 'px');
        this.renderer.setStyle(this.clipper.element.nativeElement, 'border-top-width', this.topBorderWidth + 'px');
        this.renderer.setStyle(this.clipper.element.nativeElement, 'border-bottom-width', this.topBorderWidth + 'px');

        /**
         * Задаем начальную позицию рамки либо центрируем рамку относительно компонента
         */
        this.renderer.setStyle(this.clipper.element.nativeElement, 'top', this.frameTop !== 0 ? this.frameTop / this.ratio + 'px' : (this.height / 2) - (this.frameHeight / 2) - this.topBorderWidth + 'px');
        this.renderer.setStyle(this.clipper.element.nativeElement, 'left', this.frameLeft !== 0 ? this.frameLeft / this.ratio + 'px' : (this.width / 2) - (this.frameWidth / 2) - this.leftBorderWidth + 'px');
        this.clipperTop = (this.height / 2) - (this.frameHeight / 2) - this.topBorderWidth;
        this.clipperLeft = (this.width / 2) - (this.frameWidth / 2) - this.leftBorderWidth;
        console.log('clipperTop = ', this.clipperTop);
        console.log('clipperLeft = ', this.clipperLeft);
        /**
         * Отслеживаем нажатие мыши и запоминаем текущие координаты курсора
         */

        this.renderer.listen(this.clipper.element.nativeElement, 'mousedown', (event: any) => {
            event.preventDefault();
            this.isMouseButtonPressed = true;
            this.startX = event.pageX - this.x;
            this.startY = event.pageY - this.y;

            /**
             * Отслеживаем перемещение мыши и отпускание кнопки мыши.
             * Обработчики событий присоединяем вне angular - из соображений производительности
             */
            this.zone.runOutsideAngular(() => {
                window.document.addEventListener('mousemove', this.mouseMove.bind(this));
                window.document.addEventListener('mouseup', this.mouseUp.bind(this));
            });
        });
    };


    ngAfterViewChecked(): void {

    };


    ngOnDestroy(): void {
        window.document.removeEventListener('mousemove', this.mouseMove.bind(this));
        window.document.removeEventListener('mouseup', this.mouseUp.bind(this));
    };


    mouseMove(event: any): void{
        //event.preventDefault();
        if (this.isMouseButtonPressed) {
            this.y = event.pageY - this.startY;
            this.x = event.pageX - this.startX;
            console.log('x = ', this.x);
            console.log('y = ', this.y);
            if (this.y >= -(this.topBorderWidth) && this.y <= 0) {
                this.renderer.setStyle(this.clipper.element.nativeElement, 'top', this.y + 'px');
            }
            if (this.x >= -(this.leftBorderWidth) && this.x <= 0) {
                this.renderer.setStyle(this.clipper.element.nativeElement, 'left', this.x + 'px');
            }
        }
    };


    mouseUp(event: any): void {
        event.preventDefault();
        console.log('border top', this.topBorderWidth);
        console.log('clipper top',parseInt(this.clipper.element.nativeElement.style.top));
        this.onSaveChanges.emit({photo_top: parseInt(this.clipper.element.nativeElement.style.top) < 0 && parseInt(this.clipper.element.nativeElement.style.top) < (-this.topBorderWidth) ? parseInt(this.clipper.element.nativeElement.style.top): parseInt(this.clipper.element.nativeElement.style.top) - this.frameHeight, photo_left: -(this.x + this.frameWidth), photo_zoom: this.photoZoom * this.ratio});
        if (this.isMouseButtonPressed) {
            this.isMouseButtonPressed = false;
           // if (this.x !== this.frameLeft || this.y !== this.frameTop) {
                this.isPositionChanged = true;
                this.detector.detectChanges();
            //}
        }
    };


    onChangeZoom(): void {
        console.log('zoom', this.zoom);
        this.isPositionChanged = true;
    };

    /**
     * Сохранение произведенных изменений
     */
    save(): void {
        this.isPositionChanged = false;
        this.onSaveChanges.emit({photo_top: -this.y, photo_left: -this.x, photo_zoom: this.zoom});
    };


    /**
     * Отмена произведенных изменений, сброс позиции рамки до начального состояния.
     */
    cancel(): void {
        this.isPositionChanged = false;
        this.renderer.setStyle(this.clipper.element.nativeElement, 'top', this.frameTop + 'px');
        this.renderer.setStyle(this.clipper.element.nativeElement, 'left', this.frameLeft + 'px');
        this.y = this.clipperTop;
        this.x = this.clipperLeft;
        this.clipperLeft = (this.width / 2) - (this.frameWidth / 2) - this.leftBorderWidth;
        this.onCancelChanges.emit({photo_top: this.clipperTop, photo_left: this.clipperLeft, photo_zoom: this.zoom});
    };
}
