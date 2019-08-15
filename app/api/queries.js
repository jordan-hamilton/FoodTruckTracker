const mariadb = require('mariadb');

// Import our database connection credentials
var credentials = require('../credentials.js');

const pool = mariadb.createPool(credentials.DATABASE_URL);

pool.getConnection()
    .then(function (conn) {
        console.log('Connection established.');
        conn.release();
    })
    .catch(function (err) {
        console.log(`Error: ${err}`);
    });

// Select all customer data
const getCustomers = function (request, response) {
    pool
        .query('SELECT id, lastname, firstname, username, email FROM Customers ORDER BY lastname, firstname ASC;')
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.send(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

//Select all customers who have eaten at a specified food truck
const getCustomersByFoodTruck = function (request, response) {
    pool
        .query('SELECT cust.id, cust.firstname, cust.lastname, cust.username FROM Customers AS cust\n' +
            'INNER JOIN Customers_FoodTrucks AS cft ON cft.customer = cust.id\n' +
            'INNER JOIN FoodTrucks AS ft ON ft.id = cft.foodtruck\n' +
            'WHERE ft.id = ?\n' +
            'ORDER BY cust.lastname, cust.firstname ASC;',
            [request.params.id])
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
        .query('INSERT INTO Customers (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, AES_ENCRYPT(?, ?));',
            [request.body.username, request.body.firstname, request.body.lastname, request.body.email, request.body.password, credentials.secret])
        .then(function (row) {
            console.log(row);
            request.session.customer_id = row.insertId;
            response.status(200);
            response.send('Inserted ID: ' + row.insertId);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Update a customer
const updateCustomer = function (request, response) {
    pool
        .query('UPDATE Customers SET username = ?, firstname = ?, lastname = ?, email = ? WHERE id = ?',
            [request.body.username, request.body.firstname, request.body.lastname, request.body.email, request.params.id])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Delete a customer
const deleteCustomer = function (request, response) {
    pool
        .query('DELETE from Customers WHERE id = ?;', [request.params.id])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Select all food truck data including last reviewed location from the reviews table
const getFoodTrucks = function (request, response) {
    pool
        .query({
            nestTables: '_',
            sql: 'SELECT ft.id, ft.name, ft.description, rev.location, loc.name, loc.address, loc.city, loc.state, loc.zip\n' +
                'FROM FoodTrucks ft\n' +
                'LEFT JOIN (\n' +
                'SELECT r.foodtruck AS foodtruck, r.location AS location\n' +
                'FROM Reviews r\n' +
                'INNER JOIN (\n' +
                'SELECT r2.foodtruck, r2.location, MAX(date) AS last_rev\n' +
                'FROM Reviews r2\n' +
                'GROUP BY foodtruck\n' +
                ') AS R\n' +
                'ON R.foodtruck = r.foodtruck\n' +
                'AND R.last_rev = r.date\n' +
                'GROUP BY r.foodtruck, r.location\n' +
                ') AS rev\n' +
                'ON rev.foodtruck = ft.id\n' +
                'LEFT JOIN Locations loc\n' +
                'ON loc.id = rev.location\n' +
                'ORDER BY ft.name ASC;'
        })
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
        .query('INSERT INTO FoodTrucks (name, description) VALUES (?, ?);',
            [request.body.name, request.body.description])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Update a food truck
const updateFoodTruck = function (request, response) {
    pool
        .query('UPDATE FoodTrucks SET name = ?, description = ? WHERE id = ?;',
            [request.body.name, request.body.description, request.params.id])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Delete a food truck
const deleteFoodTruck = function (request, response) {
    pool
        .query('DELETE from FoodTrucks WHERE id = ?;', [request.params.id])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Add a new customer food truck relationship into table `Customers_FoodTrucks`
const addCustomerFoodTruck = function (request, response) {
    pool
        .query('INSERT INTO Customers_FoodTrucks (customer, foodtruck) VALUES (?, ?);',
            [request.body.customer_id, request.body.food_truck_id])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Delete a customer food truck relationship
const deleteCustomerFoodTruck = function (request, response) {
    pool
        .query('DELETE FROM Customers_FoodTrucks WHERE customer = ? AND foodtruck = ?;',
            [request.body.customer_id, request.body.food_truck_id])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Select all location data
const getLocations = function (request, response) {
    pool
        .query('SELECT id, name, address, city, state, zip FROM Locations ORDER BY name ASC;')
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
        .query('INSERT INTO Locations (name, address, city, state, zip) VALUES (?, ?, ?, ?, ?);',
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

// Update a location
const updateLocation = function (request, response) {
    pool
        .query('UPDATE Locations SET name = ?, address = ?, city = ?, state = ?, zip = ? WHERE id = ?;',
            [request.body.name, request.body.address, request.body.city, request.body.state, request.body.zip, request.params.id])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Delete a location
const deleteLocation = function (request, response) {
    pool
        .query('DELETE from Locations WHERE id = ?;', [request.params.id])
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
        .query({
            dateStrings: true,
            nestTables: '_',
            sql: 'SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, \n' +
                'loc.name AS location, rev.title, rev.description\n' +
                'FROM Reviews AS rev\n' +
                'INNER JOIN Customers AS cust ON cust.id = rev.customer\n' +
                'LEFT JOIN Locations AS loc ON loc.id = rev.location\n' +
                'INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck\n' +
                'ORDER BY rev.date DESC;'
        })
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.send(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

//Select all reviews for a specified food truck
const getReviewsByFoodTruck = function (request, response) {
    pool
        .query({
            dateStrings: true,
            namedPlaceholders: true,
            nestTables: '_',
            sql: 'SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, loc.name as location, rev.title, rev.description\n' +
                'FROM Reviews AS rev\n' +
                'INNER JOIN Customers AS cust ON cust.id = rev.customer\n' +
                'INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck\n' +
                'LEFT JOIN Locations AS loc ON loc.id = rev.location\n' +
                'WHERE ft.id = :id\n' +
                'ORDER BY rev.date DESC;'
        },
            { id: request.params.id }
        )
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.send(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Select all reviews from table `Reviews` with a specified minimum rating
const getReviewsByRating = function (request, response) {
    pool
        .query({
            dateStrings: true,
            namedPlaceholders: true,
            nestTables: '_',
            sql: 'SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, loc.name as location, rev.title, rev.description\n' +
                'FROM Reviews AS rev\n' +
                'INNER JOIN Customers AS cust ON cust.id = rev.customer\n' +
                'LEFT JOIN Locations AS loc ON loc.id = rev.location\n' +
                'INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck\n' +
                'WHERE rev.rating >= :minRating\n' +
                'ORDER BY rev.date DESC;'
        },
            { minRating: request.params.minRating }
        )
        .then(function (rows) {
            console.log(rows);
            response.status(200);
            response.send(rows);
        })
        .catch(function (err) {
            response.status(500);
        });
};

// Select all reviews from table `Reviews` from a specified username using wildcards
const getReviewsByUsername = function (request, response) {
    pool
        .query({
            dateStrings: true,
            namedPlaceholders: true,
            nestTables: '_',
            sql: 'SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, loc.name as location, rev.title, rev.description\n' +
                'FROM Reviews AS rev\n' +
                'INNER JOIN Customers AS cust ON cust.id = rev.customer\n' +
                'LEFT JOIN Locations AS loc ON loc.id = rev.location\n' +
                'INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck\n' +
                'WHERE cust.username LIKE :username\n' +
                'ORDER BY rev.date DESC;'
        },
            { username: '%' + request.params.username + '%' }
        )
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
        .query('INSERT INTO Reviews (customer, date, title, rating, foodtruck, location, description) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [request.body.customer, request.body.date, request.body.title, request.body.rating, request.body.food_truck_id, request.body.location_id, request.body.description])
        .then(function (row) {
            console.log(row);
            response.status(200);
            response.send(row);
        })
        .catch(function (err) {
            response.status(500);
        });
};

module.exports = {
    getCustomers,
    getCustomersByFoodTruck,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getFoodTrucks,
    addFoodTruck,
    updateFoodTruck,
    deleteFoodTruck,
    addCustomerFoodTruck,
    deleteCustomerFoodTruck,
    getLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    getReviews,
    getReviewsByFoodTruck,
    getReviewsByRating,
    getReviewsByUsername,
    addReview
};
