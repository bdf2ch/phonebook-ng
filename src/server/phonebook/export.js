"use strict";
const excel = require('excel4node');
const phonebook = require('./api');


async function exportPhonebook() {
    let wb = new excel.Workbook();
    let ia = wb.addWorksheet('Исполнительный аппарат');
    let ses = wb.addWorksheet('ПО "Северные электрические сети"');
    let ces = wb.addWorksheet('ПО "Центральные электрические сети"');

    let ieContacts = await phonebook.getContactsByDivisionId_(16, 17, '');
    let row = 1;
    //console.log(ieContacts);

    ieContacts.forEach((group, groupIndex) => {
        let path = '';
        group.divisions.forEach((division, divisionIndex, divisions) => {
            path += divisionIndex !== 0 ? division.title : '';
            path += (divisionIndex < divisions.length - 1) && divisionIndex > 0 ? '/' : '';
        });
        //console.log(path);

        let divisionStyle = wb.createStyle({
            font: {
                size: 12,
                bold: true
            }
        });
        if (group.contacts.length > 0) {
            ia.cell(row, 1).string(path).style(divisionStyle);
            row++;
        }


        group.contacts.forEach((contact, contactIndex, contacts) => {
            console.log(contact);
            ia.cell(row, 1).string(`${contact.surname} ${contact.name} ${contact.fname}`);
            ia.cell(row, 2).string(contact.position ? contact.position : '');
            ia.cell(row, 3).string(contact.email ? contact.email : '');
            ia.cell(row, 4).string(contact.mobile ? contact.mobile : '');
            let phonesTitle = '';
            contact.phones.forEach((phone, phoneIndex) => {
                phonesTitle += phone.title;
                phonesTitle += phoneIndex < contact.phones.length - 1 ? '; ' : '';
            });
            ia.cell(row, 5).string(phonesTitle);
            row++;
        });
    });


    let sesContacts = await phonebook.getContactsByDivisionId_(14, 17, '');
    row = 1;
    //console.log(ieContacts);

    sesContacts.forEach((group, groupIndex) => {
        let path = '';
        group.divisions.forEach((division, divisionIndex, divisions) => {
            path += divisionIndex !== 0 ? division.title : '';
            path += (divisionIndex < divisions.length - 1) && divisionIndex > 0 ? '/' : '';
        });
        //console.log(path);

        let divisionStyle = wb.createStyle({
            font: {
                size: 12,
                bold: true
            }
        });
        if (group.contacts.length > 0) {
            ses.cell(row, 1).string(path).style(divisionStyle);
            row++;
        }

        group.contacts.forEach((contact) => {
            console.log(contact);
            ses.cell(row, 1).string(`${contact.surname} ${contact.name} ${contact.fname}`);
            ses.cell(row, 2).string(contact.position ? contact.position : '');
            ses.cell(row, 3).string(contact.email ? contact.email : '');
            ses.cell(row, 4).string(contact.mobile ? contact.mobile : '');
            let phonesTitle = '';
            contact.phones.forEach((phone, phoneIndex) => {
                phonesTitle += phone.title;
                phonesTitle += phoneIndex < contact.phones.length - 1 ? '; ' : '';
            });
            ses.cell(row, 5).string(phonesTitle);
            row++;
        });
    });


    let cesContacts = await phonebook.getContactsByDivisionId_(15, 17, '');
    row = 1;
    //console.log(ieContacts);

    cesContacts.forEach((group) => {
        let path = '';
        group.divisions.forEach((division, divisionIndex, divisions) => {
            path += divisionIndex !== 0 ? division.title : '';
            path += (divisionIndex < divisions.length - 1) && divisionIndex > 0 ? '/' : '';
        });
        //console.log(path);

        let divisionStyle = wb.createStyle({
            font: {
                size: 12,
                bold: true
            }
        });
        if (group.contacts.length > 0) {
            ces.cell(row, 1).string(path).style(divisionStyle);
            row++;
        }

        group.contacts.forEach((contact) => {
            console.log(contact);
            ces.cell(row, 1).string(`${contact.surname} ${contact.name} ${contact.fname}`);
            ces.cell(row, 2).string(contact.position ? contact.position : '');
            ces.cell(row, 3).string(contact.email ? contact.email : '');
            ces.cell(row, 4).string(contact.mobile ? contact.mobile : '');
            let phonesTitle = '';
            contact.phones.forEach((phone, phoneIndex) => {
                phonesTitle += phone.title;
                phonesTitle += phoneIndex < contact.phones.length - 1 ? '; ' : '';
            });
            ces.cell(row, 5).string(phonesTitle);
            row++;
        });
    });

    wb.write('export.xlsx');
}

exportPhonebook();