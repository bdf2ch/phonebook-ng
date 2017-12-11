var pg = require('pg');
var async = require('async');

if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('ces_contacts.xls');

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


for (var i = 1; i < 472; i++) {
  var contact = {
    divisionId: parseInt(worksheet['C' + i].w),
    surname: worksheet['B' + i].w.trim().split(' ')[0],
    name: worksheet['B' + i].w.trim().split(' ')[1] !== undefined ? worksheet['B' + i].w.trim().split(' ')[1] : '',
    fname: worksheet['B' + i].w.trim().split(' ')[2] !== undefined ? worksheet['B' + i].w.trim().split(' ')[2]: '',
    position: worksheet['D' + i].w.trim()
    //email: worksheet['D' + i] !== undefined ? worksheet['D' + i].w.trim() : '',
    //phone: worksheet['C' + i] !== undefined ? worksheet['C' + i].w.trim() : '',
      //ats: parseInt(worksheet['G' + i].w),
    //  phones: [],
    //mobile: worksheet['B' + i] !== undefined ? worksheet['B' + i].w : ''
  };


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
//console.log(contacts);




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
  //console.dir(i);
  //query("SELECT EXTRACT('epoch' FROM alert_time)::integer alert_time, alert_id, alert_lat, alert_lon, alert_str, alert_cc, alert_distance FROM blitz_device_former_alerts WHERE alert_locid = $1", [first.device_locid], function(error_a,rows_a,result_a) {
    //console.log(i+"!");
  //  ret.push(i);
    //callback(null);  // null -> no error
  //});


  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(
      {
        text: 'select add_contact($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [0, i.divisionId, i.surname, i.name, i.fname, i.position, '', '']
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


          /*
          async.eachSeries(i.phones, function(phone, callback) {
              client.query(
                  {
                      text: 'insert into phones (contact_id, ats_id, number) VALUES ($1, $2, $3)',
                      values: [contactId, 0, phone]
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
          */




        callback(null);  // null -> no error
      });
  });

}, function(err) {
  console.log("-END---"+err);
  //ret.push(first);
  //res.end(JSON.stringify(ret));
});

