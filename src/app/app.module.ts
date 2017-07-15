import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PhoneBookComponent } from './phone-book/phone-book.component';
import { ContactComponent } from './phone-book/contact/contact.component';
import { ContactGroupComponent } from './phone-book/contact-group/contact-group.component';
import { TextOverflowDirective } from './phone-book/text-overflow.directive';
import { CanActivatePhoneBookGuard } from './phone-book/can-activate-guard.service';
import { PhoneBookService } from './phone-book/phone-book.service';
import { DivisionTreeComponent } from './phone-book/division-tree/division-tree.component';
import { DivisionTreeItemComponent } from './phone-book/division-tree/division-tree-item/division-tree-item.component';
import { DivisionTreeService } from './phone-book/division-tree/division-tree.service';
import { DivisionOrderPipe } from './phone-book/division-tree/division-order.pipe';
import { StubComponent } from './phone-book/stub/stub.component';
import { AuthComponent } from './phone-book/auth/auth.component';

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
    BrowserAnimationsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    PhoneBookComponent,
    ContactComponent,
    ContactGroupComponent,
    TextOverflowDirective,
    DivisionTreeComponent,
    DivisionTreeItemComponent,
    DivisionOrderPipe,
    StubComponent,
    AuthComponent
  ],
  providers: [
    CanActivatePhoneBookGuard,
    PhoneBookService,
    DivisionTreeService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
