const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

/* GET customers and food trucks page. */
router.get('/', function(req, res, next) {
    const host = req.protocol + '://' + req.get('host');
    let context = {title: 'FoodTruckTracker - Reviews'};

    request(`${host}/api/reviews`)
        .then(function(body) {
            context.review = JSON.parse(body);
            return request(`${host}/api/food-trucks`);
        })
        .then(function(body) {
            context.foodTruck = JSON.parse(body);
            return request(`${host}/api/customers`);
        })
        .then(function(body) {
            context.customer = JSON.parse(body);
            res.render('customersFoodTrucks', context);
        })
        .catch(function (err) {
            console.error(err.stack);
        });
});

module.exports = router;