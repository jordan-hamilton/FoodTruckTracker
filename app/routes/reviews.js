var express = require('express');
var router = express.Router();

/* GET reviews page. */
router.get('/', function(req, res, next) {
    res.render('reviews', { title: 'FoodTruckTracker - Reviews' });
});

module.exports = router;
