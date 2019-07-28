var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('foodTrucks', { title: 'FoodTruckTracker - Food Trucks' });
});

module.exports = router;
