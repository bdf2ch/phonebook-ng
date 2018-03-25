import { Component } from '@angular/core';
import '../assets/css/styles.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import { CookieService } from "./shared/cookies/cookie.services";


@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private cookies: CookieService) {
    cookies.set({
      name: 'test',
      value: 'test',
      expires: new Date('01 Jan 2018 00:00'),
      path: '/test',
      domain: '',
      secure: true
    });
  };
}