import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { PhoneBookService } from '../phone-book.service';


@Component({
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements AfterViewChecked {
    row: number;
    margin: number;
    private container: any;

    constructor(private phoneBook: PhoneBookService,
                private detector: ChangeDetectorRef) {
        this.container = document.getElementById('app-content');
        this.phoneBook.isInFavoritesMode = true;
        this.phoneBook.isInUserAccountMode = false;
    };

    ngAfterViewChecked(): void {
        let width = this.container.clientWidth - 40;
        this.row = Math.floor(width / 260);
        this.margin = (width - this.row * 260) / (this.row - 1);
        this.detector.detectChanges();
    };
};