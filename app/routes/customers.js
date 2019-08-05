const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

/* GET customers page. */
router.get('/', function(req, res, next) {
    const host = req.protocol + '://' + req.get('host');
    let context = {title: 'FoodTruckTracker - Customers'};

    request(`${host}/api/customers`)
        .then(function(body) {
            context.customer = JSON.parse(body);
            res.render('customers', context);
        })
});

module.exports = router;
