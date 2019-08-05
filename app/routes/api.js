var express = require('express');
var router = express.Router();

var api = require('../api/queries.js');

/* GET all customers. */
router.get('/customers', api.getCustomers);
router.post('/customers', api.addCustomer);

/* GET all food trucks. */
router.get('/food-trucks', api.getFoodTrucks);

/* GET all locations. */
router.get('/locations', api.getLocations);

/* GET all reviews. */
router.get('/reviews', api.getReviews);

module.exports = router;