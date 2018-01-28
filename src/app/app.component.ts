import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import '../assets/css/styles.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import { CookieService } from "./utilities/cookies/cookie.services";
import { PhoneBookService } from './phone-book/phone-book.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private cookies: CookieService,
              private route: ActivatedRoute,
              private phoneBook: PhoneBookService) {

    cookies.set({
      name: 'test',
      value: 'test',
      expires: new Date('01 Jan 2018 00:00'),
      path: '/test',
      domain: '',
      secure: true
    });

    console.log('test cookie', this.cookies.getByName('test'));
    console.log('lolka cookie', this.cookies.getByName('lolka'));



  };

};