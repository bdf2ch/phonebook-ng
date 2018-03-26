import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PhoneBookManagerModule } from './manager/manager.module';
import { AngularTransistorModule } from '@bdf2ch/angular-transistor';


import { AppComponent } from './app.component';
import { PhoneBookComponent } from './shared/phone-book/phone-book.component';

import { ContactsOrderPipe } from './contacts/contact-group/contacts-order.pipe';

import { ContactComponent } from './contacts/contact/contact.component';
import { ContactGroupComponent } from './contacts/contact-group/contact-group.component';
import { TextOverflowDirective } from './shared/phone-book/text-overflow.directive';
import { UserSessionGuard } from './shared/session/session.guard';
import { PhoneBookService } from './shared/phone-book/phone-book.service';
import { DivisionTreeComponent } from './shared/divisions/division-tree/division-tree.component';
import { DivisionTreeItemComponent } from './shared/divisions/division-tree/division-tree-item/division-tree-item.component';
import { DivisionTreeService } from './shared/divisions/division-tree/division-tree.service';
import { DivisionOrderPipe } from './shared/divisions/division-order.pipe';
import { StubComponent } from './shared/stub/stub.component';
import { SessionService} from './shared/session/session.service';
import { CookieService } from './shared/cookies/cookie.services';

import { CompanySelectorComponent } from './shared/organizations/organization-selector/organization-selector.component';
import { ExceptSelectedOrganizationPipe } from './shared/organizations/except-selected-organization.pipe';
import { TypeAheadComponent } from './shared/typeahead/typeahead.component';
import { TypeAheadOptionComponent } from './shared/typeahead/typeahead-option/typeahead-option.component';
import { UserAccountComponent } from './account/account.component';
import { FavoritesComponent } from './contacts/favorites-list/favorites.component';
import { HelpComponent } from './help/help.component';

/**
 * Organizations management
 */
import { OrganizationsService } from './shared/organizations/organizations.service';

/**
 * Divisions management
 */
import { DivisionsService } from './shared/divisions/divisions.service';

/**
 * Office management
 */
import { OfficeListComponent } from './shared/offices/office-list/office-list.component';
import { OfficeListCanActivateGuard } from './shared/offices/office-list/can-activate.guard';
import { OfficesService } from "./shared/offices/offices.service";
import { OfficesByOrganizationPipe } from './shared/offices/offices-by-organization.pipe';

/**
 * ATS management
 */
import { AtsService } from './shared/ats/ats.service';

/**
 * Phone management
 */
import { PhonesService } from './shared/phones/phones.service';

/**
 * Contacts
 */
import { ContactsService } from './contacts/contacts.service';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactListResolveGuard } from './contacts/contact-list/resolve.guard';
import { FavoriteContactsGuard } from './contacts/favorites-list.guard';


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
          path: 'division/:divisionId',
          component: ContactListComponent,
            resolve: [ContactListResolveGuard]
        },
      {
        path: 'favorites',
        component: FavoritesComponent,
          canActivate: [FavoriteContactsGuard]
      },
      {
        path: 'account',
        component: UserAccountComponent
      },
      {
        path: 'help',
        component: HelpComponent
      },
        {
          path: 'offices',
            component: OfficeListComponent,
            canActivate: [OfficeListCanActivateGuard]
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
      OfficesByOrganizationPipe,
      OfficeListComponent
  ],
  providers: [
      UserSessionGuard,
      FavoriteContactsGuard,
      PhoneBookService,
      DivisionTreeService,
      SessionService,
      CookieService,
      OfficesService,
      DivisionsService,
      OrganizationsService,
      ContactsService,
      AtsService,
      PhonesService,
      OfficeListCanActivateGuard,
      ContactListResolveGuard
  ],
  bootstrap: [ AppComponent ],
  exports: [AngularTransistorModule]
})
export class AppModule {}