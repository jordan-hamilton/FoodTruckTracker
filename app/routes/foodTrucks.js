var express = require('express');
var router = express.Router();

/* GET food trucks page. */
router.get('/', function(req, res, next) {
    res.render('foodTrucks', { title: 'FoodTruckTracker - Food Trucks' });
});

module.exports = router;
