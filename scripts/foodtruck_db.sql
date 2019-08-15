-- Food Truck Review Database Definition Queries
-- CS 340 Summer 2019
-- Group 16: Jordan Hamilton and Nathan McKimpson

-- 
-- Table structure for table `Customers`
-- 
DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(20) NOT NULL,
  firstname varchar(50) NOT NULL,
  lastname varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  password varbinary(32) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB; 

--
-- Insert intial data into table `Customers`
--
LOCK TABLES Customers WRITE;
INSERT INTO Customers VALUES 
(1, 'michaelarose40', 'Michaela', 'Rose', 'michaela_rose@yahoo.com', AES_ENCRYPT('password1', 'cuddlynarwhal')),
(2, 'amazinganila', 'Anila', 'Freeman', 'amazinganila@hotmail.com', AES_ENCRYPT('password2', 'cuddlynarwhal')),
(3, 'bbarnes', 'Bryan', 'Barnes', 'bbarnes@gmail.com', AES_ENCRYPT('password3', 'cuddlynarwhal')),
(4, 'alvinw', 'Alvin', 'Willis', 'notachipmunk@gmail.com', AES_ENCRYPT('password4', 'cuddlynarwhal')),
(5, 'freddie87', 'Fred', 'Harper', 'fred.harper@nasa.gov', AES_ENCRYPT('password5', 'cuddlynarwhal'));
UNLOCK TABLES;

-- 
-- Table structure for table `Locations`
-- 
DROP TABLE IF EXISTS Locations;
CREATE TABLE Locations (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  address varchar(100) NOT NULL,
  city varchar(50) NOT NULL,
  state char(2) NOT NULL,
  zip int(5) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB; 

--
-- Insert intial data into table `Locations`
--
LOCK TABLES Locations WRITE;
INSERT INTO Locations VALUES 
(1, 'Civic Center Park', 'Broadway and Colfax Ave', 'Denver', 'CO', 80202),
(2, 'Coors Field', '2001 Blake St.', 'Denver', 'CO', 80205),
(3, 'Thomas and 9th', '235 9th Ave. N.', 'Seattle', 'WA', 98109),
(4, 'Denny Park', '100 Dexter Ave. N.', 'Seattle', 'WA', 98109),
(5, '1stBank Center', '11450 Broomfield Ln.', 'Broomfield', 'CO', 80021);
UNLOCK TABLES; 

-- 
-- Table structure for table `FoodTrucks`
-- 
DROP TABLE IF EXISTS FoodTrucks;
CREATE TABLE FoodTrucks (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL, 
  description text,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

--
-- Insert intial data into table `FoodTrucks`
--
LOCK TABLES FoodTrucks WRITE;
INSERT INTO FoodTrucks VALUES 
(1, 'Pecos Pit Bar-B-Que', "We are excited to announce your longtime local Seattle staple Pecos Pit BBQ has hit the street with it's shiny new food truck! Pecos Pit is known for our NW style slow roasted, wood smoked BBQ along side top notch service, and unlimited smiles (smiles on the house!) Our truck will be serving up everything from our trip down memory lane classic Frito Pies to our famous deliciously sloppy sandwiches. (Menu to change daily) Make sure to join us on any of our social medias to keep up to date on our food truck progress."), 
(2, 'NaanSense', "Authentic Home-style Indian Food NaanSense food truck offers delicious Indian food, made from scratch every day, and always with the best ingredients and never with anything artificial. We are 2 chefs who set out to bring affordable, authentic, Indian food to the streets of Seattle. Sourced locally whenever possible, we prepare our food with only all natural ingredients and love. Follow us on Facebook or twitter for our awesome daily vegetarian and non-vegetarian specials. We hope to see and serve you soon."),
(3, 'Basic Kneads Pizza', "All our pizzas are cooked on-site, in our mobile wood-fired oven. When we serve a pizza, we have to warn people to be careful, they are bubbling hot, with steam filling the air above. We toss our salads right at your event, and our cooks come to you. We feel it’s that important."), 
(4, "Biker Jim's Gourmet Dogs", "Biker Jim’s craveable concept pimps 15 gourmet sausages, ranging from wild boar and Alaskan reindeer to pheasant cordon bleu and an award-winning vegan dog. Toppings are limited only by your imagination, and we have a killer condiment bar with all the fixings, including locally made Elevation ketchup. Our proprietary dogs, served on fresh-baked-rolls, and sourced from the best purveyors, are plump and juicy, ridiculously good and a whole lot of fun to eat."), 
(5, 'Migration Taco', "Migration Taco is Denver’s first and (we hope!) best vegan taco truck. Our menu includes delicious vegan tacos, nachos, mac & cheese, relleno rolls, burritos, and more, all made in house with organic and local ingredients when possible.");
UNLOCK TABLES;

-- 
-- Table structure for table `Customers_FoodTrucks`
-- 
DROP TABLE IF EXISTS Customers_FoodTrucks;
CREATE TABLE Customers_FoodTrucks (
  customer int(11) NOT NULL,
  foodtruck int(11)NOT NULL,
  PRIMARY KEY (customer, foodtruck),
  KEY (customer),
  FOREIGN KEY (customer) REFERENCES Customers (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (foodtruck) REFERENCES FoodTrucks (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE 
) ENGINE=InnoDB; 

--
-- Insert intial data into table `Customers_FoodTrucks`
--
LOCK TABLES Customers_FoodTrucks WRITE;
INSERT INTO Customers_FoodTrucks VALUES 
(1, 2),
(1, 1), 
(3, 3),
(2, 4),
(5, 4);
UNLOCK TABLES;

-- 
-- Table structure for table `Reviews`
-- 
DROP TABLE IF EXISTS Reviews;
CREATE TABLE Reviews (
  id int(11) NOT NULL AUTO_INCREMENT,
  customer int(11) NOT NULL,
  date date NOT NULL, 
  title varchar(100) NOT NULL, 
  rating int(1),
  foodtruck int(11) NOT NULL,
  location int(11),
  description text,
  PRIMARY KEY (id),
  FOREIGN KEY (foodtruck) REFERENCES FoodTrucks (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (location) REFERENCES Locations (id) 
  ON UPDATE CASCADE 
  ON DELETE SET NULL,
  FOREIGN KEY (customer) REFERENCES Customers (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
) ENGINE=InnoDB;

--
-- Insert intial data into table `Reviews`
--
LOCK TABLES Reviews WRITE;
INSERT INTO Reviews VALUES 
(1, 1, '2019-05-29', 'Pretty good Desi food for Seattle', 3, 2, 3, "Pro tip: the dishes near the bottom of the ever changing menu are the spiciest. If you are looking for authentic flavors, this one isn't too bad!"), 
(2, 1, '2019-07-23', 'Straight forward, juicy barbeque', 4, 1, 4, "The portions were just right. I had chicken with spicy sauce on a baked potato, and it was delicious. I would recommend this to a friend."),
(3, 3, '2019-7-27', 'My favorite food truck. Soooo goood!', 5, 3, NULL, NULL), 
(4, 2, '2019-06-04', 'Great potential but still growing', NULL, 4, 2, "This review is based on experience at the new restaurant location.  I was really looking forward to trying Biker Jim's...being a mobile food fan and a hot dog connoisseur.  We stumbled on the new restaurant location by chance, learned it had only been open for 2 days.  

PROS - Convenient ordering at the counter.  Clean, industrial open kitchen layout.  Full bar.  Extensive condiment bar stocked with sauerkraut, pickles, jalapeno, horseradish cream (really good!), organic ketchup, different types of mustards...etc.  Good sides - fried green tomatoes and mac n cheese squares.

CONS - Meat to bun ratio was skewed toward the bread.  I had the Coney - beef dog w/ sweet meat sauce...it sounded good and looked good, but there was so much gap between the top of the meat filling and the edge of the bread.  My bf had the same problem and his was loaded with fried onions.

I fully support a well-dressed dog, but too much bread ruined the flavor.  I understand the cart offers different options, probably price too.  Hope the restaurant will work out its kinks!"),
(5, 5, '2019-06-14', 'T.R.O.U.B.L.E.', 4, 4, 5, "Yep I can spell it and get into it... a lot at Biker Jim's. 

The menu is incredible, creative, and mesmerizing as it took me a good 10 minutes himming and hawing over which delicious dog would be all mine. 

I settled on the pheasant which was sweet and sassy. I also got the cauliflower dish which is a can't miss and healthy to boot!!

I loved the mystery brand soda fountain and hopes it continues to remain a mystery. I can't wait however to try the lavender soda I saw in the fridge, next time!!");
UNLOCK TABLES; 
