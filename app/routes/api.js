var express = require('express');
var router = express.Router();

var api = require('../api/queries.js');

/* GET all customers. */
router.get('/customers', api.getCustomers);

/* POST a new customer */
router.post('/customers', api.addCustomer);

/* GET all food trucks. */
router.get('/food-trucks', api.getFoodTrucks);

/* POST a new food truck */
router.post('/food-trucks', api.addFoodTruck);

/* GET all locations. */
router.get('/locations', api.getLocations);

/* GET all reviews. */
router.get('/reviews', api.getReviews);

module.exports = router;