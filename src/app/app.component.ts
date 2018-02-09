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
  private browser: any;

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
    console.log(window.navigator.userAgent);


      function browser() {
          var ua= window.navigator.userAgent, tem,
              M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
          if(/trident/i.test(M[1])){
              tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
              return {name:'IE',version:(tem[1] || '')};
          }
          if(M[1]=== 'Chrome'){
              tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
              if(tem!= null) return {name:tem[1].replace('OPR', 'Opera'),version:tem[2]};
          }
          M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
          if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
          return {name:M[0],version:M[1]};
      };

      console.log(browser()); //Object { name: "Firefox", version: "42" }

      /*
      if (navigator.browserSpecs.name == 'Firefox') {
          // Do something for Firefox.
          if (navigator.browserSpecs.version > 42) {
              // Do something for Firefox versions greater than 42.
          }
      }
      else {
          // Do something for all other browsers.
      }
      */



  };

};