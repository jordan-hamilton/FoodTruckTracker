const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

/* GET food trucks page. */
router.get('/', function(req, res, next) {
    const host = req.protocol + '://' + req.get('host');
    let context = {title: 'FoodTruckTracker - Food Trucks'};

    request(`${host}/api/food-trucks`)
        .then(function(body) {
            context.foodTruck = JSON.parse(body);
            res.render('foodTrucks', context);
        })
});

module.exports = router;
