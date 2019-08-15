var express = require('express');
var router = express.Router();

var api = require('../api/queries.js');

/* GET all customers. */
router.get('/customers', api.getCustomers);

/* GET customers by food truck. */
router.get('/customers/food-truck/:id', api.getCustomersByFoodTruck);

/* POST a new customer */
router.post('/customers', api.addCustomer);

/* PUT (update) a customer */
router.put('/customers/:id', api.updateCustomer);

/* DELETE a customer */
router.delete('/customers/:id', api.deleteCustomer);

/* GET all food trucks. */
router.get('/food-trucks', api.getFoodTrucks);

/* POST a new food truck */
router.post('/food-trucks', api.addFoodTruck);

/* PUT (update) a food truck */
router.put('/food-trucks/:id', api.updateFoodTruck);

/* DELETE a food truck */
router.delete('/food-trucks/:id', api.deleteFoodTruck);

/* POST a new customer-food truck relationship */
router.post('/customers-food-trucks', api.addCustomerFoodTruck);

/* DELETE a customer-food truck relationship */
router.delete('/customers-food-trucks/customer/:customer_id/food-truck/:food_truck_id', api.deleteCustomerFoodTruck);

/* GET all locations. */
router.get('/locations', api.getLocations);

/* POST a new location */
router.post('/locations', api.addLocation);

/* PUT (update) a location */
router.put('/locations/:id', api.updateLocation);

/* DELETE a location */
router.delete('/locations/:id', api.deleteLocation);

/* GET all reviews. */
router.get('/reviews', api.getReviews);

/* GET all reviews of a specific food truck. */
router.get('/reviews/food-truck/:id', api.getReviewsByFoodTruck);

/* GET all reviews over a specific rating. */
router.get('/reviews/rating/:minRating', api.getReviewsByRating);

/* GET all reviews from a specified username using wildcards. */
router.get('/reviews/customer/:id', api.getReviewsByCustomerId);

/* POST a new review */
router.post('/reviews', api.addReview);

module.exports = router;