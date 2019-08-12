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

/* PUT (update) a food truck */
router.put('/food-trucks/:id', api.updateFoodTruck);

/* DELETE a food truck */
router.delete('/food-trucks/:id', api.deleteFoodTruck);

/* GET all locations. */
router.get('/locations', api.getLocations);

/* POST a new location */
router.post('/locations', api.addLocation);

/* GET all reviews. */
router.get('/reviews', api.getReviews);

/* POST a new review */
router.post('/reviews', api.addReview);

module.exports = router;