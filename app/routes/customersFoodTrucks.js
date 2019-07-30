var express = require('express');
var router = express.Router();

/* GET customers and food trucks page. */
router.get('/', function(req, res, next) {
    res.render('customersFoodTrucks', { title: 'FoodTruckTracker - Customers & Food Trucks' });
});

module.exports = router;