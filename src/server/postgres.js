var pg = require('pg');

pool = new pg.Pool({
    user: 'docuser',
    database: 'phone',
    password: 'docasu',
    host: '10.50.0.242',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
});

pool.on('error', function (err, client) {
    console.error('postgres idle client error', err.message, err.stack);
});


module.exports = {
    query: function (query) {
        console.log('query = ', query);
        return pool.query(query['text'], query['values'])
            .then((res) => res.rows[0][query['func']]);
    }
};