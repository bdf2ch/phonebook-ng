import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
    selector: '[upload]'
})
export class UploadDirective {

    constructor(private element: ElementRef) {};

    @HostListener('change') onChange(): void {
        console.log(this.element.nativeElement);
    };

};
