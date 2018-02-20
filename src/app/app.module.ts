import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PhoneBookManagerModule } from './manager/manager.module';
import { AngularTransistorModule } from '@bdf2ch/angular-transistor';


import { AppComponent } from './app.component';
import { PhoneBookComponent } from './phone-book/phone-book.component';
import { ContactListComponent } from './phone-book/contact-list/contact-list.component';
import { ContactsOrderPipe } from './phone-book/contact-group/contacts-order.pipe';

import { ContactComponent } from './phone-book/contact/contact.component';
import { ContactGroupComponent } from './phone-book/contact-group/contact-group.component';
import { TextOverflowDirective } from './phone-book/text-overflow.directive';
import { UserSessionGuard } from './phone-book/session.guard';
import { PhoneBookService } from './phone-book/phone-book.service';
import { DivisionTreeComponent } from './phone-book/division-tree/division-tree.component';
import { DivisionTreeItemComponent } from './phone-book/division-tree/division-tree-item/division-tree-item.component';
import { DivisionTreeService } from './phone-book/division-tree/division-tree.service';
import { DivisionOrderPipe } from './phone-book/division-tree/division-order.pipe';
import { StubComponent } from './phone-book/stub/stub.component';
import { SessionService} from './phone-book/session.service';
import { CookieService } from './utilities/cookies/cookie.services';

import { CompanySelectorComponent } from './phone-book/company-selector/company-selector.component';
import { ExceptSelectedOrganizationPipe } from './common/organizations/except-selected-organization.pipe';
import { TypeAheadComponent } from './phone-book/typeahead/typeahead.component';
import { TypeAheadOptionComponent } from './phone-book/typeahead/typeahead-option/typeahead-option.component';
import { UserAccountComponent } from './phone-book/user-account/user-account.component';
import { FavoritesComponent } from './phone-book/favorites/favorites.component';
import { HelpComponent } from './phone-book/help/help.component';

/**
 * Organizations management
 */
import { OrganizationsService } from './common/organizations/organizations.service';

/**
 * Divisions management
 */
import { DivisionsService } from './common/divisions/divisions.service';

/**
 * Office management
 */
import { OfficesService } from "./common/offices/offices.service";
import { OfficesByOrganizationPipe } from './common/offices/offices-by-organization.pipe';

const routes: Routes = [
  {
    path: '',
    component: PhoneBookComponent,
    canActivate: [ UserSessionGuard ],
    children: [
      {
        path: '',
        component: ContactListComponent
      },
      {
        path: 'favorites',
        component: FavoritesComponent
      },
      {
        path: 'account',
        component: UserAccountComponent
      },
      {
        path: 'help',
        component: HelpComponent
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
    AngularTransistorModule,
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
    CompanySelectorComponent,
    FavoritesComponent,
    HelpComponent,
    UserAccountComponent,
    ExceptSelectedOrganizationPipe,
    TypeAheadComponent,
    TypeAheadOptionComponent,
      OfficesByOrganizationPipe
  ],
  providers: [
    UserSessionGuard,
    PhoneBookService,
    DivisionTreeService,
    SessionService,
    CookieService,
      OfficesService,
      DivisionsService,
      OrganizationsService
  ],
  bootstrap: [ AppComponent ],
  exports: [AngularTransistorModule]
})
export class AppModule {}