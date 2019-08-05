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

// Select all customer data
const getCustomers = function (request, response) {
    pool
        .query("SELECT id, username, firstname, lastname, email FROM Customers;")
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.send(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Add a customer 
const addCustomer = function (request, response) {
    secret = credentials.secret;
    pool
        .query('INSERT INTO Customers (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, AES_ENCRYPT(?, ?))', 
        [request.body.username, request.body.firstname, request.body.lastname, request.body.email, request.body.password, credentials.secret])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send('Inserted ID: ' + row.insertId);
        })
        .catch(function(err) {
            response.status(500);
        });
};

// Select all food truck data
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

// Add a food truck
const addFoodTruck = function (request, response) {
    pool
        .query('INSERT INTO FoodTrucks (name, description, location) VALUES (?, ?, ?)', 
        [request.body.name, request.body.description, request.body.location])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send('Inserted ID: ' + row.insertId);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Select all location data
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

// Add a new location
const addLocation = function (request, response) {
    pool
        .query('INSERT INTO Locations (name, address, city, state, zip) VALUES (?, ?, ?, ?, ?)', 
        [request.body.name, request.body.address, request.body.city, request.body.state, request.body.zip])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });  
};

// Select all review data
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

// Add a new review
const addReview = function (request, response) {
    pool
        .query('INSERT INTO Reviews (customer, date, title, rating, foodtruck, location, description) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [request.body.customer, request.body.date, request.body.title, request.body.rating, request.body.food_truck_id, request.body.location_id, request.body.description])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
}

module.exports = {
    getCustomers,
    addCustomer,
    getFoodTrucks,
    addFoodTruck,
    getLocations, 
    addLocation,
    getReviews, 
    addReview
}
