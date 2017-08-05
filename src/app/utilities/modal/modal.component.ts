import { Component, ElementRef, HostListener, AfterViewChecked, Input } from '@angular/core';


@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements AfterViewChecked {
    depth: number;
    @Input() width: number;
    caption: string;

    constructor(private element: ElementRef) {
        this.depth = 0;
        this.width = 300;
    };


    @HostListener('window:resize') onWindowResize () {
        //this.element.nativeElement.children[0].children[0].style.left = window.innerWidth / 2 - this.width / 2 + 'px';
        //this.element.nativeElement.children[0].children[0].style.top = window.innerHeight / 2 - this.element.nativeElement.children[0].offsetHeight / 2 + 'px';
    };


    ngAfterViewChecked(): void {
    };
};