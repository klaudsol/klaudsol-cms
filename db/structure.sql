CREATE TABLE `entities` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `slug` varchar(255) NOT NULL, 
  `entity_type_id` int(11) NOT NULL, 
  PRIMARY KEY (`id`), 
  KEY `idx_slug` (`slug`), 
  KEY `idx_entity_type_id` (`entity_type_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `entity_types` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(255) NOT NULL, 
  `slug` varchar(255) NOT NULL, 
  PRIMARY KEY (`id`), 
  KEY `idx_slug` (`slug`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `entity_type_attributes` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(255) NOT NULL, 
  `entity_type_id` int(11) NOT NULL, 
  `type` varchar(255) NOT NULL, 
  `order` int(11) NOT NULL DEFAULT '1', 
  PRIMARY KEY (`id`), 
  KEY `idx_entity_type_id` (`entity_type_id`), 
  KEY `idx_order` (`order`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `attributes` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(255) NOT NULL, 
  `entity_id` int(11) NOT NULL, 
  `type` varchar(255) NOT NULL, 
  `order` int(11) NOT NULL DEFAULT '1', 
  PRIMARY KEY (`id`), 
  KEY `idx_entity_id` (`entity_id`), 
  KEY `idx_order` (`order`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `values` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `entity_id` int(11) NOT NULL, 
  `attribute_id` int(11) NOT NULL, 
  `value_string` varchar(255) DEFAULT NULL, 
  `value_long_string` text, 
  `value_integer` int(11) DEFAULT NULL, 
  `value_datetime` datetime DEFAULT NULL, 
  `value_double` decimal(19,4) DEFAULT NULL, 
  PRIMARY KEY (`id`), 
  KEY `idx_entities_attributes` (`entity_id`,`attribute_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


