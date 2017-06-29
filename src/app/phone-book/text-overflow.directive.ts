import {Directive, Input, ElementRef, HostListener, Renderer } from '@angular/core';


@Directive({
    selector: '[text-overflow]'
})
export class TextOverflowDirective  {
    @Input('text-overflow') width: number;

    constructor (private element: ElementRef,
                 private renderer: Renderer) {};


    @HostListener('DOMSubtreeModified') onChange() {
        let content = this.element.nativeElement.innerText;
        if (content.length > this.width) {
            this.element.nativeElement.textContent = content.substr(0, this.width + 1) + '...';
            this.renderer.setElementProperty(this.element.nativeElement, 'title', content);
        }
    };


};