import { Component, ElementRef, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { PhoneBookService } from "../phone-book.service";


@Component({
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, AfterViewChecked {
    row: number;
    margin: number;
    container: any;
    private users = [
        {
            fio: 'Иванов Иван Иванович',
            position: 'Менеджер по сбору бутылок',
            photo: ''
        },
        {
            fio: 'Петров Пер Петрович',
            position: 'Тестировщик тестовых тестов',
            photo: ''
        },
        {
            fio: 'Сидоров Сидор Сидорович',
            position: 'инженер-программист',
            photo: ''
        },
        {
            fio: 'Константинопольский Константин Константинович',
            position: 'никто',
            photo: ''
        }
    ];


    constructor(private detector: ChangeDetectorRef,
                private element: ElementRef,
                private phoneBook: PhoneBookService) {
        this.container = document.getElementById('app-content');
    };


    ngOnInit(): void {

    };


    ngAfterViewChecked(): void {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        this.detector.detectChanges();
    };
};
