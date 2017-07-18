var pg = require('pg');


var config = {
    user: 'docuser',
    database: 'phone',
    password: 'docasu',
    host: '10.50.0.242',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};


pool = new pg.Pool(config);
pool.on('error', function (err, client) {
    console.error('postgres idle client error', err.message, err.stack);
});


module.exports = {
    query: function (query) {
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }

            if (query) {
                console.log(query);
                client.query({text: query['text'], values: query['values'] ? query['values'] : []}, function(err, result) {
                    done(err);
                    if(err) {
                        console.error('error running query', err);
                        return;
                    }
                    return JSON.stringify(result.rows[0][query['func']]);
                });
            }
        });
    }
};