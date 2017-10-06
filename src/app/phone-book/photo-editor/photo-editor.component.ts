import { Component, Input, Output, ViewChild, ViewContainerRef, Renderer2, AfterViewInit, EventEmitter } from '@angular/core';
import { IUserPhotoPosition } from '../../models/user-photo-position.interface';


@Component({
    selector: 'photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements AfterViewInit{
    @Input() url: string | null = null;
    @Input() blankUrl: string | null = 'http://10.50.4.7:4444/assets/images/users/no_photo.png';
    @Input() height: number = 0;
    @Input() width: number = 0;
    @Output() onSaveChanges: EventEmitter<IUserPhotoPosition> = new EventEmitter();
    @ViewChild('clipper', { read: ViewContainerRef }) clipper: ViewContainerRef;
    clipperWrapper: any | null = null;
    private isMouseDown: boolean = false;
    private isPositionChanged: boolean = false;
    startX: number = 0;
    startY: number = 0;
    x: number = 0;
    y: number = 0;
    clipperTop: number = 0;
    clipperLeft: number = 0;

    constructor(private renderer: Renderer2) {};

    ngAfterViewInit(): void {
        this.clipperWrapper = this.clipper.element.nativeElement.parentElement;

        //this.renderer.setStyle(this.clipperWrapper, 'clip', 'rect(' + this.y + 'px, ' + this.x + 'px, ' + this.height + 'px, ' + this.width + 'px)');

        this.renderer.setStyle(this.clipper.element.nativeElement, 'top', (this.clipperWrapper.clientHeight / 2) - (this.height / 2) + 'px');
        this.renderer.setStyle(this.clipper.element.nativeElement, 'left', (this.clipperWrapper.clientWidth / 2) - (this.width / 2) + 'px');

        this.renderer.listen(this.clipper.element.nativeElement, 'mousedown', (event: any) => {
            this.isMouseDown = true;
            event.preventDefault();
            this.startX = event.pageX - this.x;
            this.startY = event.pageY - this.y;
        });

        this.renderer.listen(this.clipper.element.nativeElement, 'mousemove', (event: any) => {
            if (this.isMouseDown) {
                this.isPositionChanged = true;
                this.y = event.pageY - this.startY;
                this.x = event.pageX - this.startX;
                if (this.y >= 0 && this.y <= this.clipperWrapper.clientHeight - this.height) {
                    this.renderer.setStyle(this.clipper.element.nativeElement, 'top', this.y + 'px');
                    //this.renderer.setStyle(this.clipper.element.nativeElement, 'background-position-y', this.y * -1 + 'px');
                }
                if (this.x >= 0 && this.x <= this.clipperWrapper.clientWidth - this.width) {
                    this.renderer.setStyle(this.clipper.element.nativeElement, 'left', this.x + 'px');
                    //this.renderer.setStyle(this.clipper.element.nativeElement, 'background-position-x', this.x * -1 + 'px');
                }

                //this.renderer.setStyle(this.clipperWrapper, 'clip', this.y + 'px, ' + (this.clipperWrapper.clientWidth - this.width) + 'px, ' + (this.clipperWrapper.clientHeight - this.height)+ 'px, ' + this.x + 'px');
            }
        });

        this.renderer.listen(this.clipper.element.nativeElement, 'mouseup', () => {
            this.isMouseDown = !this.isMouseDown;
            //this.renderer.removeClass(this.clipper.element.nativeElement, 'moving');
        });
    };

    save(): void {
        this.onSaveChanges.emit({top: this.y, left: this.x});
    };
}
