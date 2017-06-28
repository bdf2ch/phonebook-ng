import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PhoneBookComponent } from './phone-book/phone-book.component';
import { ContactComponent } from './phone-book/contact/contact.component';
import { CanActivatePhoneBookGuard } from './phone-book/can-activate-guard.service';
import { PhoneBookService } from './phone-book/phone-book.service';
import { DivisionTreeComponent } from './phone-book/division-tree/division-tree.component';
import { DivisionTreeItemComponent } from './phone-book/division-tree/division-tree-item/division-tree-item.component';
import { DivisionTreeService } from './phone-book/division-tree/division-tree.service';

const routes: Routes = [
  {
    path: '',
    component: PhoneBookComponent,
    canActivate: [ CanActivatePhoneBookGuard ]
  }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    PhoneBookComponent,
    ContactComponent,
    DivisionTreeComponent,
    DivisionTreeItemComponent
  ],
  providers: [
    CanActivatePhoneBookGuard,
    PhoneBookService,
    DivisionTreeService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
