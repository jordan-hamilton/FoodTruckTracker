const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

/* GET reviews page. */
router.get('/', function(req, res, next) {
    const host = req.protocol + '://' + req.get('host');
    let context = {title: 'FoodTruckTracker - Reviews'};
    context.customer_id = req.session.customer_id;

    request(`${host}/api/reviews`)
        .then(function(body) {
            context.review = JSON.parse(body);
            return request(`${host}/api/food-trucks`);
        })
        .then(function(body) {
            context.foodTruck = JSON.parse(body);
            return request(`${host}/api/locations`);
        })
        .then(function(body) {
            context.location = JSON.parse(body);
            return request(`${host}/api/customers`);
        })
        .then(function(body) {
           context.customer = JSON.parse(body);
           res.render('reviews', context);
        })
        .catch(function (err) {
            console.error(err.stack);
        });
});

module.exports = router;
