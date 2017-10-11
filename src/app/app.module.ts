import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PhoneBookManagerModule } from './manager/manager.module';
import { AppComponent } from './app.component';
import { PhoneBookComponent } from './phone-book/phone-book.component';
import { ContactListComponent } from './phone-book/contact-list/contact-list.component';
import { ContactsOrderPipe } from './phone-book/contact-group/contacts-order.pipe';

import { ContactComponent } from './phone-book/contact/contact.component';
import { ContactGroupComponent } from './phone-book/contact-group/contact-group.component';
import { TextOverflowDirective } from './phone-book/text-overflow.directive';
import { DivisionsGuard } from './phone-book/divisions.guard';
import { UserSessionGuard } from './phone-book/session.guard';
import { PhoneBookService } from './phone-book/phone-book.service';
import { DivisionTreeComponent } from './phone-book/division-tree/division-tree.component';
import { DivisionTreeItemComponent } from './phone-book/division-tree/division-tree-item/division-tree-item.component';
import { DivisionTreeService } from './phone-book/division-tree/division-tree.service';
import { DivisionOrderPipe } from './phone-book/division-tree/division-order.pipe';
import { StubComponent } from './phone-book/stub/stub.component';
import { AuthComponent } from './phone-book/auth/auth.component';
import { AuthService } from './phone-book/auth/auth.service';

import { UserMenuComponent } from './phone-book/user-menu/user-menu.component';

import { EditContactComponent } from './phone-book/edit-contact/edit-contact.component';

import { SessionService} from './phone-book/session.service';
import { CookieService } from './utilities/cookies/cookie.services';
//import { ModalComponent } from './utilities/modal/modal.component';

import { UploadDirective }  from './utilities/upload/upload.directive';
import { PhotoEditorComponent } from './phone-book/photo-editor/photo-editor.component';

import { ModalComponent } from './utilities/modal/modal.component';
import { ModalService } from './utilities/modal/modal.service';
import { CompanySelectorComponent } from './phone-book/company-selector/company-selector.component';
import { ExceptSelectedOrganizationPipe } from './phone-book/company-selector/except-selected-organization.pipe';

const routes: Routes = [
  {
    path: '',
    component: PhoneBookComponent,
    canActivate: [ UserSessionGuard ],
    children: [
      {
        path: '',
        component: ContactListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    PhoneBookManagerModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    PhoneBookComponent,
    ContactListComponent,
    ContactsOrderPipe,
    ContactComponent,
    ContactGroupComponent,
    TextOverflowDirective,
    DivisionTreeComponent,
    DivisionTreeItemComponent,
    DivisionOrderPipe,
    StubComponent,
    AuthComponent,
    UserMenuComponent,
    EditContactComponent,
    ModalComponent,
    PhotoEditorComponent,
    CompanySelectorComponent,
    UploadDirective,
    ExceptSelectedOrganizationPipe
  ],
  providers: [
    DivisionsGuard,
    UserSessionGuard,
    PhoneBookService,
    DivisionTreeService,
    AuthService,
    SessionService,
    CookieService,
    ModalService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {};
