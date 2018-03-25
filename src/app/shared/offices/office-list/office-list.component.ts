import { Component, ChangeDetectorRef } from '@angular/core';
import { OrganizationsService } from '../../organizations/organizations.service';
import { OfficesService } from '../offices.service';
import { SessionService } from '../../session/session.service';
import { PhoneBookService } from '../../phone-book/phone-book.service';
import { ModalsService } from '@bdf2ch/angular-transistor';
import { NgForm } from '@angular/forms';
import { Office } from '../../../models/office.model';
import { Contact } from '../../../models/contact.model';


@Component({
    templateUrl: './office-list.component.html',
    styleUrls: ['./office-list.component.css']
})
export class OfficeListComponent {
    private filteredOffices: Office[];

    constructor(private detector: ChangeDetectorRef,
                private session: SessionService,
                private organizations: OrganizationsService,
                private offices: OfficesService,
                private phoneBook: PhoneBookService,
                private modals: ModalsService) {
        this.filteredOffices = [];
    };


    /**
     * открытие модального окна добавления нового офиса организации
     */
    openNewOfficeModal() {
        this.modals.get('new-office-modal').open();
    };


    /**
     * Закрытие модального окна добавлени нового офиса организации
     * @param {NgForm} form - форма добавления нового офиса
     */
    closeNewOfficeModal(form: NgForm): void {
        form.reset();
        this.detector.detectChanges();
        this.offices.new.restoreBackup();
    };


    /**
     * Добавление нового офиса организации
     */
    addOffice(): void {
        this.offices.add(this.offices.new, this.session.session ? this.session.session.token : '')
            .subscribe((result: Office | boolean) => {
                if (result !== false) {
                    console.log(result);
                    this.modals.get('new-office-modal').close();
                }
            });
    };


    /**
     * Открытие модального окна редактирования офиса организации
     * @param {Office} office - Редактируемый офис организации
     */
    openEditOfficeModal(office: Office): void {
        this.offices.selected = office;
        this.modals.get('edit-office-modal').open();
    };


    /**
     * Закрытие модального окна редактирования офиса организации
     * @param {NgForm} form - Форма редактирования офиса организации
     */
    closeEditOfficeModal(form: NgForm): void {
        this.offices.selected.restoreBackup();
        form.reset({
            address: this.offices.selected.address,
            city: this.offices.selected.city
        });
        this.detector.detectChanges();
        this.offices.selected = null;
    };


    /**
     * Сохранение изменения измененного офиса организации
     * @param {NgForm} form - Форма редактирования офиса организации
     */
    editOffice(form: NgForm): void {
        this.offices.edit(this.offices.selected, this.session.session ? this.session.session.token : '')
            .subscribe((result: boolean) => {
                if (result) {
                    form.reset({
                        address: this.offices.selected.address,
                        city: this.offices.selected.city
                    });
                    this.detector.detectChanges();
                    this.modals.get('edit-office-modal').close();
                }
            });
    };


    /**
     * Открытие модального окна удаления офиса организации
     * @param {Office} office - Удаляемый офис организации
     */
    openDeleteOfficeModal(office: Office): void {
        this.offices.selected = office;
        this.modals.get('delete-office-modal').open();
    };


    /**
     * Удаление офиса организации
     */
    deleteOffice(): void {
        this.offices.delete(this.offices.selected, this.session.session ? this.session.session.token : '')
            .subscribe((result: boolean) => {
                if (result) {
                    this.modals.get('delete-office-modal').close();
                    /**
                     * Если в избранных есть абоненты, относящиеся к удаленному офису - обнуляем у них данные об офисе
                     */
                    this.phoneBook.favoriteContacts.contacts.forEach((contact: Contact) => {
                        if (contact.officeId === this.offices.selected.id) {
                            contact.officeId = 0;
                        }
                    });
                    /**
                     * Если текущий пользователь относится к удаленному офису - обнуляем у него данные об офисе
                     */
                    if (this.session.user.officeId === this.offices.selected.id) {
                        this.session.user.officeId = 0;
                    }
                    this.offices.selected = null;
                }
            });
    };
}