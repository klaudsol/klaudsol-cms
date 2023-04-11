--- data here are for demo data, to demonstrate to new users the capabilies of KlaudSol CMS.
--- Experienced users may opt to skip this.

LOCK TABLES `attributes` WRITE;
INSERT INTO `attributes` VALUES 
  (1,'title','text',1,1),
  (2,'body','textarea',2,1),
  (3,'food_name','text',1,2),
  (4,'price','float',2,2),
  (5,'description','textarea',3,2),
  (6,'name','text',1,3),
  (7,'image','image',2,3),
  (8,'link','link',3,3),
  (9,'title','text',1,9),
  (10,'lyrics','text',2,9),
  (11,'name','text',1,10),
  (12,'address','text',2,10),
  (13,'price','text',3,10),
  (14,'lot_area','text',4,10),
  (15,'description','textarea',5,10),
  (16,'images','image',6,10),
  (17,'latitude','float',7,10),
  (18,'longitude','float',8,10),
  (19,'name','text',1,11),
  (20,'name','text',1,12),
  (21,'property_features','text',9,10);
UNLOCK TABLES;

LOCK TABLES `entities` WRITE;
INSERT INTO `entities` VALUES 
  (1,'how-to-run-shopify-cli-in-aws-cloud-9',1),
  (2,'how-to-deploy-your-shopify-cli-app-on-aws-ec2-using-docker',1),
  (3,'porchetta',2),
  (89,'donut',2),
  (92,'milktea',2),
  (94,'bacon',2),
  (96,'cassava-cake',2),
  (102,'chocolate-cake',2),
  (105,'chicken-noodle-soup',2),
  (106,'aws',3),
  (107,'react',3),
  (108,'react-native',3),
  (109,'nextjs',3),
  (110,'nodejs',3),
  (111,'strapi',3),
  (112,'aws-amplify',3),
  (113,'aws-aurora-serverless',3),
  (114,'aws-elastic-beanstalk',3),
  (132,'its-late-in-the-evening',9),
  (133,'bgc',12),
  (134,'aurelia-residences',10);
UNLOCK TABLES;

LOCK TABLES `entity_types` WRITE;
INSERT INTO `entity_types` VALUES 
  (1,'Articles','articles'),
  (2,'Menu','menus'),
  (3,'Technologies','tech');
UNLOCK TABLES;

LOCK TABLES `values` WRITE;
INSERT INTO `values` VALUES 
  (1,1,1,'How to run Shopify CLI in AWS Cloud 9',NULL,NULL,NULL,NULL,1),
  (2,1,2,NULL,'I find AWS Cloud9 to be a very performant and useful programming development environment. What makes Cloud9 so appealing for me is its fast internal network speed, making downloading dependency libraries and containers several times faster than if I rely on my internet service provider. This fast internal network speed is also useful for creating apps that communicate with 3rd party APIs such as Shopify. Developing apps that continually talk to API’s on a slow network is such a pain that it robs developers of all the joys of software development.',NULL,NULL,NULL,1),(49,2,1,'How to Deploy Your Shopify CLI App on AWS EC2 using Docker',NULL,NULL,NULL,NULL,NULL),(50,2,2,NULL,'You must be able to host your Shopify CLI App before merchants can install your app in their stores. Among the plethora of available hosts to us, Amazon Web Services (AWS) Elastic Compute Cloud (EC2) is a strong contender.',NULL,NULL,NULL,NULL),(51,3,3,'Porchetta',NULL,NULL,NULL,NULL,NULL),(52,3,4,NULL,NULL,NULL,NULL,4000.0000,NULL),(53,3,5,NULL,'Masarap, promise!',NULL,NULL,NULL,NULL),(95,65,1,'Kamote',NULL,NULL,NULL,NULL,NULL),(96,65,2,'Kamote',NULL,NULL,NULL,NULL,NULL),(97,67,1,'',NULL,NULL,NULL,NULL,NULL),(98,67,2,'',NULL,NULL,NULL,NULL,NULL),(99,71,1,NULL,NULL,NULL,NULL,NULL,NULL),(100,71,2,NULL,NULL,NULL,NULL,NULL,NULL),(101,72,1,'\'asdfsdaf\'',NULL,NULL,NULL,NULL,NULL),(102,72,2,NULL,NULL,NULL,NULL,NULL,NULL),(105,74,1,'\'asfdsadf\'',NULL,NULL,NULL,NULL,NULL),(106,74,2,NULL,NULL,NULL,NULL,NULL,NULL),(107,75,1,'\'asfdsadfasdfsadf\'',NULL,NULL,NULL,NULL,NULL),(108,75,2,NULL,'\'aasdfsafasdasdfasfda\'',NULL,NULL,NULL,NULL),(109,76,1,'\'asfdsadfasdfsadf\'',NULL,NULL,NULL,NULL,NULL),(110,76,2,NULL,'\'aasdfsafasdasdfasfda\'',NULL,NULL,NULL,NULL),(111,77,1,'\'Title\'',NULL,NULL,NULL,NULL,NULL),(112,77,2,NULL,'\'Body\'',NULL,NULL,NULL,NULL),(113,78,32,'\'food name\'',NULL,NULL,NULL,NULL,NULL),(114,78,33,NULL,NULL,NULL,NULL,12345.6700,NULL),(115,78,34,NULL,'\'Super sarap mehn.\'',NULL,NULL,NULL,NULL),(116,79,32,'\'sdfsadfa\'',NULL,NULL,NULL,NULL,NULL),(117,79,33,NULL,NULL,NULL,NULL,12313.2200,NULL),(118,79,34,NULL,'\'asdfsadfasdfsadfasfdsafasfsadfasfsdafd\'',NULL,NULL,NULL,NULL),(122,81,1,'\'This is the title of my article\'',NULL,NULL,NULL,NULL,NULL),(123,81,2,NULL,'\'Lorem ipsum dolor\'',NULL,NULL,NULL,NULL),(140,89,3,'donut',NULL,NULL,NULL,NULL,NULL),(141,89,4,NULL,NULL,NULL,NULL,99.0000,NULL),(142,89,5,NULL,'best donut in the world!',NULL,NULL,NULL,NULL),(147,92,3,'milktea',NULL,NULL,NULL,NULL,NULL),(148,92,4,NULL,NULL,NULL,NULL,110.0000,NULL),(149,92,5,NULL,'coco militia',NULL,NULL,NULL,NULL),(150,93,3,'Porchetta',NULL,NULL,NULL,NULL,NULL),(151,93,4,NULL,NULL,NULL,NULL,4000.0000,NULL),(152,93,5,NULL,'Masarap, promise!',NULL,NULL,NULL,NULL),(153,94,3,'bacon',NULL,NULL,NULL,NULL,NULL),(154,94,4,NULL,NULL,NULL,NULL,199.0000,NULL),(155,94,5,NULL,'yummy bacon',NULL,NULL,NULL,NULL),(158,96,3,'Cassava Cake',NULL,NULL,NULL,NULL,NULL),(159,96,4,NULL,NULL,NULL,NULL,100.2500,NULL),(160,96,5,NULL,'So yummy, so good!',NULL,NULL,NULL,NULL),(163,98,1,'hehehe',NULL,NULL,NULL,NULL,NULL),(164,98,2,NULL,'ahahaha',NULL,NULL,NULL,NULL),(171,102,3,'Fudge Cake',NULL,NULL,NULL,NULL,NULL),(172,102,4,NULL,NULL,NULL,NULL,499.0000,NULL),(173,102,5,NULL,'Yummy Chocolate cake!!!',NULL,NULL,NULL,NULL),(186,105,3,'Chicken Noodle Soup',NULL,NULL,NULL,NULL,NULL),(187,105,4,NULL,NULL,NULL,NULL,500.0000,NULL),(188,105,5,NULL,'CHICKEN NOODLE SOUP!!!',NULL,NULL,NULL,NULL),(189,106,6,'AWS',NULL,NULL,NULL,NULL,NULL),(190,106,7,'/assets/img/aws-logo.svg',NULL,NULL,NULL,NULL,NULL),(191,106,8,'https://aws.amazon.com',NULL,NULL,NULL,NULL,NULL),(192,107,6,'React',NULL,NULL,NULL,NULL,NULL),(193,107,7,'/assets/img/react-logo.svg',NULL,NULL,NULL,NULL,NULL),(194,107,8,'https://reactjs.org',NULL,NULL,NULL,NULL,NULL),(195,108,6,'React Native',NULL,NULL,NULL,NULL,NULL),(196,108,7,'/assets/img/react-native-logo.png',NULL,NULL,NULL,NULL,NULL),(197,108,8,'https://reactnative.dev',NULL,NULL,NULL,NULL,NULL),(198,109,6,'NextJS',NULL,NULL,NULL,NULL,NULL),(199,109,7,'/assets/img/nextjs-logo.png',NULL,NULL,NULL,NULL,NULL),(200,109,8,'https://nextjs.org',NULL,NULL,NULL,NULL,NULL),(201,110,6,'NodeJS',NULL,NULL,NULL,NULL,NULL),(202,110,7,'/assets/img/nodejs-logo.svg',NULL,NULL,NULL,NULL,NULL),(203,110,8,'https://nodejs.org',NULL,NULL,NULL,NULL,NULL),(204,111,6,'Strapi',NULL,NULL,NULL,NULL,NULL),(205,111,7,'/assets/img/Strapi.monogram.logo.png',NULL,NULL,NULL,NULL,NULL),(206,111,8,'https://strapi.io',NULL,NULL,NULL,NULL,NULL),(207,112,6,'AWS Amplify',NULL,NULL,NULL,NULL,NULL),(208,112,7,'/assets/img/amplify-logo.png',NULL,NULL,NULL,NULL,NULL),(209,112,8,'https://aws.amazon.com/amplify',NULL,NULL,NULL,NULL,NULL),(210,113,6,'Amazon Aurora Serverless',NULL,NULL,NULL,NULL,NULL),(211,113,7,'/assets/img/aurora-serverless.png',NULL,NULL,NULL,NULL,NULL),(212,113,8,'https://aws.amazon.com/rds/aurora/serverless',NULL,NULL,NULL,NULL,NULL),(213,114,6,'AWS Elastic Beanstalk',NULL,NULL,NULL,NULL,NULL),(214,114,7,'/assets/img/elastic-beanstalk.png',NULL,NULL,NULL,NULL,NULL),(215,114,8,'https://aws.amazon.com/elasticbeanstalk',NULL,NULL,NULL,NULL,NULL),(248,132,9,'It\'s late in the evening',NULL,NULL,NULL,NULL,NULL),(249,132,10,'She\'s wondering what clothes to wear',NULL,NULL,NULL,NULL,NULL),(250,133,20,'BGC',NULL,NULL,NULL,NULL,NULL);
UNLOCK TABLES;






