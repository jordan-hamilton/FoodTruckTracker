var express = require('express');
var router = express.Router();

/* GET locations page. */
router.get('/', function(req, res, next) {
    res.render('locations', { title: 'FoodTruckTracker - Locations' });
});

module.exports = router;
