const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

/* GET locations page. */
router.get('/', function(req, res, next) {
    const host = req.protocol + '://' + req.get('host');
    let context = {title: 'FoodTruckTracker - Locations'};

    request(`${host}/api/locations`)
        .then(function(body) {
            context.location = JSON.parse(body);
            res.render('locations', context);
        })
});

module.exports = router;
