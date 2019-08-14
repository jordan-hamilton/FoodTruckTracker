-- Food Truck Review Database Manipulation Queries
-- CS 340 Summer 2019
-- Group 16: Nathan McKimpson and Jordan Hamilton

-- Note: For all queries in this file, the colon ':' character denotes variables that will have
--   data from the backend programming language

--
-- SELECT functions for customers 
--
-- Select all customers from table `Customers`
SELECT id, lastname, firstname, username, email FROM Customers ORDER BY lastname, firstname ASC;

-- Select all customers who have eaten at a specified food truck
SELECT cust.id, cust.firstname, cust.lastname, cust.username FROM Customers AS cust
INNER JOIN Customers_FoodTrucks AS cft ON cft.customer = cust.id
INNER JOIN FoodTrucks AS ft ON ft.id = cft.foodtruck
WHERE ft.id = :foodtruckIdInput 
ORDER BY cust.lastname, cust.firstname ASC;

--
-- SELECT functions for food trucks
-- 
-- Select all food trucks from table `FoodTrucks`
SELECT ft.id, ft.name, ft.description, loc.name, loc.address, loc.city, loc.state, loc.zip
FROM FoodTrucks AS ft
LEFT JOIN Locations AS loc ON loc.id = ft.location 
ORDER BY ft.name ASC;

-- Select all food trucks at a specified location 
SELECT ft.id, ft.name, ft.description, loc.name, loc.address, loc.city, loc.state, loc.zip
FROM FoodTrucks AS ft
INNER JOIN Locations AS loc ON loc.id = ft.location
WHERE ft.location = :locationIdInput

--
-- SELECT functions for locations
-- 
-- Select all locations from table `Locations`
SELECT id, name, address, city, state, zip FROM Locations ORDER BY name ASC;

--
-- SELECT functions for reviews
-- 
-- Select all reviews from table `Reviews`
SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, loc.name as location, rev.title, rev.description
FROM Reviews AS rev
INNER JOIN Customers AS cust ON cust.id = rev.customer
INNER JOIN Locations AS loc ON loc.id = rev.location
INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck 
ORDER BY rev.date DESC;

-- Select all reviews from table `Reviews` with a specified minimum rating
SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, loc.name as location, rev.title, rev.description
FROM Reviews AS rev
INNER JOIN Customers AS cust ON cust.id = rev.customer
INNER JOIN Locations AS loc ON loc.id = rev.location
INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck
WHERE rev.rating >= :minRatingInput;

-- Select all reviews from table `Reviews` from the specified customer
SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, loc.name as location, rev.title, rev.description
FROM Reviews AS rev
INNER JOIN Customers AS cust ON cust.id = rev.customer
INNER JOIN Locations AS loc ON loc.id = rev.location
INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck
WHERE cust.id = :customerIdInput;

-- Select all reviews for a specified food truck
SELECT rev.id, cust.username, rev.date, rev.rating, ft.name AS vendor, loc.name as location, rev.title, rev.description
FROM Reviews AS rev
INNER JOIN Customers AS cust ON cust.id = rev.customer
INNER JOIN FoodTrucks AS ft ON ft.id = rev.foodtruck
INNER JOIN Locations AS loc ON loc.id = rev.location
WHERE ft.id = :foodtruckIdInput

--
-- INSERT new rows into DB tables
--
-- Add a new customer into table `Customers`
INSERT INTO Customers (username, firstname, lastname, email, password) VALUES (:usernameInput, :firstnameInput, :lastnameInput, :emailInput, AES_ENCRYPT(:passwordInput, 'cuddlynarwhal'));

-- Add a new location into table `Locations`
INSERT INTO Locations (name, address, city, state, zip) VALUES (:nameInput, :addressInput, :cityInput, :stateInput, :zipInput);

-- Add a new food truck into table `FoodTrucks`
INSERT INTO FoodTrucks (name, description, location) VALUES (:nameInput, :descriptionInput, :locationIdInput);

-- Add a new customer food truck relationship into table `Customers_FoodTrucks`
INSERT INTO Customers_FoodTrucks (customer, foodtruck) VALUES (:customerIdInput, :foodtruckIdInput);

-- Add a new review into table `Reviews`
INSERT INTO Reviews (customer, date, title, rating, foodtruck, location, description) VALUES (:customerIdInput, :dateInput, :titleInput, :ratingInput, :foodtruckIdInput, :locationIdInput, :descriptionInput);

--
-- DELETE functions
--
-- Delete a food truck from table `FoodTrucks`
-- Deleting a food truck will also remove all reviews of the food truck
DELETE FROM FoodTrucks WHERE id=:foodtruckIdInput

-- Delete a customer
-- Deleting a customer will also remove all reviews from the customer
DELETE FROM Customers WHERE id=:customerIdInput

-- Delete a location
-- Deleting a location will set the location of a review to null
DELETE FROM Locations WHERE id=:locationIdInput

-- Delete a customer food truck relationship
DELETE FROM Customers_FoodTrucks WHERE customer = :customerIdInput AND foodtruck = :foodtruckIdInput;

--
-- UPDATE functions
--
-- Update a review written by a customer
UPDATE Reviews 
SET
  date = CURRENT_DATE(),
  title = :titleInput,
  rating = :ratingInput,
  foodtruck = :foodtruckInput,
  location = :locationInput,
  description = :descriptionInput
WHERE id = :reviewIdInput AND customer = :reviewAuthor;

-- Update food truck information
UPDATE FoodTrucks
SET
  name = :nameInput,
  description = :descriptionInput,
  location = :locationInput
WHERE id = :foodtruckIdInput;

-- Update location information
UPDATE Locations 
SET
  name = :nameInput,
  address = :addressInput,
  city = :cityInput,
  state = :stateInput,
  zip = :zipInput
WHERE id = :locationIdInput;
