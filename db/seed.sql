/* seeds here are built-in data that are required for KlaudSol CMS to work properly
these need to be run.*/

LOCK TABLES `people` WRITE;
REPLACE INTO `people`(`id`,`first_name`,`last_name`,`login_enabled`,`email`,`encrypted_password`,`salt`,`role`) VALUES 
  (1,'John','Doe',1,'admin@klaudsol.com','1686254050d3f34b4efe72a4ce628e3e123d6699901283e2f3cdc1bdae83e508','5a3KTYp6Xg','');
UNLOCK TABLES;

LOCK TABLES `capabilities` WRITE;
REPLACE INTO `capabilities` VALUES 
  (1,"read_contents","Read contents",1),
  (2,"write_contents","Add, Update, or Delete contents",1),
  (3,"read_content_types","Read Content types",1),
  (4,"write_content_types","Add, Update, or Delete content types",1),
  (5,"read_setttings","Get global setting values",1),
  (6,"write_settings","Modify global setting values",1),
  (7,"modify_logo","Change the logo on the front page, defaults to the KlaudSol logo",1),
  (8,"read_users","Read users' capabilities",1),
  (9,"write_users","Modify users' capabilities",1),
  (10,"read_groups","Read groups' capabilities",1),
  (11,"write_groups","Modify groups' capabilities",1);
UNLOCK TABLES;

LOCK TABLES `groups` WRITE;
REPLACE INTO `groups` VALUES 
  (1,"Super Administrators","Reserved group for KlaudSol installation and setup.",1),
  (2,"Administrators","The group for administrators from the business side.",1),
  (3,"Editors","The group tasked to create and maintain content.",1),
  (4,"Guests","The default group of a user, unless promoted to another group.",1);
UNLOCK TABLES;

LOCK TABLES `people_groups` WRITE;
REPLACE INTO `people_groups` VALUES (1,1);
UNLOCK TABLES;


LOCK TABLES `group_capabilities` WRITE;
REPLACE INTO `group_capabilities` VALUES 
  /*Super Administrators*/
  (1,1,NULL,NULL,NULL),
  (1,2,NULL,NULL,NULL),
  (1,3,NULL,NULL,NULL),
  (1,4,NULL,NULL,NULL),
  (1,5,NULL,NULL,NULL),
  (1,6,NULL,NULL,NULL),
  (1,7,NULL,NULL,NULL),
  (1,8,NULL,NULL,NULL),
  (1,9,NULL,NULL,NULL),
  (1,10,NULL,NULL,NULL),
  (1,11,NULL,NULL,NULL),
  /*Administrators*/
  (2,1,NULL,NULL,NULL),
  (2,2,NULL,NULL,NULL),
  (2,3,NULL,NULL,NULL),
  (2,4,NULL,NULL,NULL),
  (2,5,NULL,NULL,NULL),
  (2,6,NULL,NULL,NULL),
  (2,7,NULL,NULL,NULL),
  (2,8,NULL,NULL,NULL),
  (2,9,NULL,NULL,NULL),
  (2,10,NULL,NULL,NULL),
  (2,11,NULL,NULL,NULL),
  /*Editors*/
  (3,1,NULL,NULL,NULL),
  (3,2,NULL,NULL,NULL),
  (3,3,NULL,NULL,NULL),
  (3,4,NULL,NULL,NULL),
  /*Guests*/
  (4,1,NULL,NULL,NULL),
  (4,3,NULL,NULL,NULL);
UNLOCK TABLES;