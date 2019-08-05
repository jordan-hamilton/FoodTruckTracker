const mariadb = require('mariadb');

// Import our database connection credentials if they're not stored in an environment variable
if (!process.env.DATABASE_URL) {
    var credentials = require('../credentials.js');
}

const pool = mariadb.createPool(process.env.DATABASE_URL || credentials.DATABASE_URL);

pool.getConnection()
    .then(function(conn) {
        console.log('Connection established.');
        conn.release();
    })
    .catch(function(err) {
        console.log(`Error: ${err}`);
    });

const getCustomers = function (request, response) {
    pool
        .query("SELECT id, username, firstname, lastname, email FROM Customers;")
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.json(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

const getFoodTrucks = function (request, response) {
    pool
        .query({nestTables: '_',
            sql: 'SELECT ft.id, ft.name, ft.description, loc.name, loc.address, loc.city, loc.state, loc.zip\n' +
            'FROM FoodTrucks AS ft\n' +
            'INNER JOIN Locations AS loc ON loc.id = ft.location;'})
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.send(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

const getLocations = function (request, response) {
    pool
        .query('SELECT id, name, address, city, state, zip FROM Locations;')
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.send(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

const getReviews = function (request, response) {
    pool
        .query({dateStrings: true,
            nestTables: '_',
            sql: 'SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, loc.name as location, rev.title, rev.description\n' +
            'FROM Reviews AS rev\n' +
            'INNER JOIN Customers AS cust ON cust.id = rev.customer\n' +
            'INNER JOIN Locations AS loc ON loc.id = rev.location\n' +
            'INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck;'})
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.send(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

module.exports = {
    getCustomers,
    getLocations,
    getFoodTrucks,
    getReviews
}
