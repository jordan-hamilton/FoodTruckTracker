var express = require('express');
var router = express.Router();

/* GET customers and food trucks page. */
router.get('/', function(req, res, next) {
    const host = req.protocol + '://' + req.get('host');
    let context = {title: 'FoodTruckTracker - Reviews'};

    res.render('customersFoodTrucks', context);
});

module.exports = router;