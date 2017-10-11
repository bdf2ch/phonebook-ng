import {
  Component, Inject, OnInit, AfterViewChecked, HostListener, Input, Output, EventEmitter, forwardRef,
  ElementRef, trigger, state, transition, style, animate
} from '@angular/core';
import { ModalService } from './modal.service';


@Component({
  selector: 'modal-content',
  template: '<div></div>'
})
export class ModalContentComponent {};


@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    trigger("fog", [
      state('true', style({
        background: 'rgba(0, 0, 0, 0.5)'
      })),
      transition('void => *', animate("200ms linear")),
      transition('* => void', animate("200ms linear")),
    ]),
    trigger("modal", [
      state('true', style({
        transform: 'scale(1.0)'
      })),
      state('false', style({
        transform: 'scale(0.1)'
      })),
      transition('void => true', animate(100)),
      transition('* => void', animate(100)),
    ])
  ]
})
export class ModalComponent implements OnInit, AfterViewChecked {
  @Input() id: string;
  @Input() title: string;
  @Input() width: number;
  @Input() contentHeight: number = 0;
  @Input() private footer: boolean;
  @Output() private onOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() private onClose: EventEmitter<void> = new EventEmitter<void>();
  private opened: boolean = false;


  constructor(@Inject(forwardRef(() => ModalService)) private modals: ModalService,
              private element: ElementRef) {};


  ngOnInit() {
    if (this.id === null || this.id === undefined || this.id === "") {
      console.error("no id specified");
      return;
    }
    if (this.title === null || this.title === undefined || this.title === "") {
      console.error("no title specified");
      return;
    }
    this.modals.register(this);
  };


  ngAfterViewChecked () {
    if (this.element.nativeElement.children.length > 0) {
      this.element.nativeElement.children[1].style.top = window.innerHeight / 2 - this.element.nativeElement.children[1].clientHeight / 2 + 'px';
      this.element.nativeElement.children[1].style.left = window.innerWidth / 2 - this.width / 2 + 'px';
    }
  };


  @HostListener('window:resize', ['$event']) onWindowResize (event: any) {
    if (this.opened) {
      this.element.nativeElement.children[1].style.left = event.target.innerWidth / 2 - this.width / 2 + 'px';
      this.element.nativeElement.children[1].style.top = event.target.innerHeight / 2 - this.element.nativeElement.children[1].clientHeight / 2 + 'px';
    }
  };


  open() {
    this.opened = true;
    this.onOpen.emit();
  };


  close (withoutCallback?: boolean) {
    this.opened = false;
    if (withoutCallback === undefined || withoutCallback !== true)
      this.onClose.emit();
  };

};
