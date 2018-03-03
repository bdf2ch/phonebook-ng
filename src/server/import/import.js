var pg = require('pg');
var async = require('async');

if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('tgk.xls');

var first_sheet_name = workbook.SheetNames[0];
var address_of_cell = 'A1';

/* Get worksheet */
var worksheet = workbook.Sheets[first_sheet_name];

//console.dir(worksheet.A36);


var config = {
  user: 'docuser',
  database: 'phone',
  password: 'docasu',
  host: '10.50.0.173',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};
var pool = new pg.Pool(config);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});
var contacts = [];


for (var i = 2; i < 176; i++) {
  var contact = {
    divisionId: parseInt(worksheet['A' + i].w),
    surname: worksheet['B' + i].w.trim().split(' ')[0],
    name: worksheet['B' + i].w.trim().split(' ')[1] !== undefined ? worksheet['B' + i].w.trim().split(' ')[1] : '',
    fname: worksheet['B' + i].w.trim().split(' ')[2] !== undefined ? worksheet['B' + i].w.trim().split(' ')[2]: '',
    position: worksheet['C' + i].w.trim(),
    email: worksheet['F' + i] !== undefined ? worksheet['F' + i].w.trim() : '',
    phonesRaw: worksheet['D' + i] !== undefined ? worksheet['D' + i].w.trim().split(';') : '',
      //ats: parseInt(worksheet['G' + i].w),
    phones: [],
    mobilesRaw: worksheet['E' + i] !== undefined ? worksheet['E' + i].w.trim().split(';') : '',
      mobiles: []
  };

  if (contact.mobilesRaw) {
    contact.mobilesRaw.forEach((raw) => {
      if (raw) {
          //console.log(raw.trim());
          contact.mobiles.push(raw.trim());
      }
    });
    contact.mobiles = contact.mobiles.join(',');
  }

  if (contact.phonesRaw) {
      contact.phonesRaw.forEach((raw) => {
          if (raw) {
              let phone = {
                  atsId: 0,
                  number: ''
              };

              if (raw.trim().indexOf('(525)') !== -1) {
                  phone.number = raw.trim().substr(5, raw.length - 1);
                  phone.atsId = 61;
                  //console.log(raw, phone);
                  contact.phones.push(phone);
              } else if (raw.trim().indexOf('525') !== -1) {
                  phone.number = raw.trim().substr(3, raw.length - 1);
                  phone.atsId = 61;
                  //console.log(raw, phone);
                  contact.phones.push(phone);
              }

              if (raw.trim().indexOf('(81553)') !== -1) {
                  phone.number = raw.trim().substr(7, raw.length - 1);
                  phone.number = phone.number.trim();
                  phone.atsId = 12;
                  //console.log(raw, phone);
                  contact.phones.push(phone);
              }

              if (raw.trim().indexOf('(8152)') !== -1) {
                  phone.number = raw.trim().substr(6, raw.length - 1);
                  phone.number = phone.number.trim();
                  phone.atsId = 11;
                  //console.log(raw, phone);
                  contact.phones.push(phone);
              }

              if (raw.trim().indexOf('(81533)') !== -1) {
                  phone.number = raw.trim().substr(7, raw.length - 1);
                  phone.number = phone.number.trim();
                  phone.atsId = 20;
                  //console.log(raw, phone);
                  contact.phones.push(phone);
              }

              if (raw.trim().indexOf('(81554)') !== -1) {
                  phone.number = raw.trim().substr(7, raw.length - 1);
                  phone.number = phone.number.trim();
                  phone.atsId = 36;
                  //console.log(raw, phone);
                  contact.phones.push(phone);
              }

              if (raw.trim().indexOf('6-') !== -1 && raw.trim().length < 10) {
                  phone.number = raw.trim().substr(0, raw.length - 1);
                  phone.number = phone.number.trim();
                  phone.atsId = 12;
                  //console.log(raw, phone);
                  contact.phones.push(phone);
              }
          }
      });
  }



  //console.log(contact.phones);


  /*
  if (contact.phone !== null && contact.phone !== '') {
    if (contact.phone.indexOf(' ') !== -1) {
      splittedBySpace = contact.phone.split(' ');
      for (var x = 0; x < splittedBySpace.length; x++) {
        if (splittedBySpace[x].indexOf(',') !== -1) {
          var splittedByComma = splittedBySpace[x].split(',');
          for (var z = 0; z < splittedByComma.length; z++) {
            if (splittedByComma[z] !== '') {
              contact.phones.push(splittedByComma[z]);
            }
          }
        } else {
          contact.phones.push(splittedBySpace[x]);
        }
      }
      //console.log('before: ' + contact.phone + ' | after: ' + contact.phones);
    } else {
        contact.phones.push(contact.phone);
    }
  }
  */

  contacts.push(contact);
  //var fio = worksheet['A' + i].w.trim().split(' ');
  //var mobile = worksheet['B' + i] !== undefined ? worksheet['B' + i].w : '';
  //var phones = worksheet['C' + i] !== undefined ? worksheet['C' + i].w.trim() : '';
  //var position = worksheet['D' + i].w.trim();
  //var divisionId = parseInt(worksheet['E' + i].w);
  //console.log(fio, mobile, phones, position, divisionId);


  /*
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query({
      text: 'SELECT * FROM contacts WHERE surname = $1 AND name = $2 AND fname = $3 AND division_id = $4',
      values: [fio[0], fio[1], fio[2], divisionId]},
      function(err, result) {
        done(err);
        if(err) {
          console.error('error running query', err);
          return;
        }
        console.log(result.rows);
        addContact(0, divisionId, fio[0], fio[1], fio[2], position, '', mobile, '', 0);
    });
  });
  */
}
//console.dir(contacts);




function addContact(userId, divisionId, surname, name, fname, position) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    client.query(
      {
        text: 'select add_contact($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [userId, divisionId, surname, name, fname, position, '', '']
      },
      function(err, result) {
        done(err);
        if(err) {
          console.error('error running query', err);
          return;
        }
        //console.log(result.rows[0] + ' ADDED');
      });
  });
};





async.eachSeries(contacts, function(i, callback) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(
      {
        text: 'select add_contact($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [0, i.divisionId, i.surname, i.name, i.fname, i.position, i.email, i.mobiles]
      },
      function(err, result) {
        done(err);
        if(err) {
          console.error('error running query', err);
          return;
        }
        console.dir(result.rows[0]['add_contact']);
        var contactId = result.rows[0]['add_contact']['id'];
        console.log('contactId = ', contactId);


          async.eachSeries(i.phones, function(phone, callback) {
              client.query(
                  {
                      text: 'INSERT INTO phones (contact_id, ats_id, number) VALUES ($1, $2, $3)',
                      values: [contactId, phone.atsId, phone.number]
                  },
                  function(err, result) {
                      done(err);
                      if(err) {
                          console.error('error running query', err);
                          return;
                      }
                      //console.log(result.rows[0] + ' ADDED');
                      //var contactId = result.rows[0]['id'];
                      callback(null);  // null -> no error
                  });
          });


        callback(null);  // null -> no error
      });
  });

}, function(err) {
  console.log("-END---"+err);
  //ret.push(first);
  //res.end(JSON.stringify(ret));
});


