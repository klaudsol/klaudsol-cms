CREATE TABLE `companies` (  --TODO: rename as sme_companies
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(255) NOT NULL, 
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (`id`) 
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  
CREATE TABLE `people` ( --TODO: rename as sme_people
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `first_name` varchar(255) NOT NULL DEFAULT '', 
  `last_name` varchar(255) NOT NULL DEFAULT '', 
  `company_position` varchar(255) NOT NULL DEFAULT '', 
  `login_enabled` tinyint(1) NOT NULL DEFAULT '0', 
  `email` varchar(255) DEFAULT NULL, 
  `encrypted_password` varchar(255) DEFAULT NULL, 
  `salt` varchar(255) DEFAULT NULL, 
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `company_id` int(11) NOT NULL,  --TODO: rename as sme_company_id
  `session` varchar(255) NULL,  --TODO: Remove field
  `session_expiry` datetime NULL, --TODO: Remove field
  PRIMARY KEY (`id`),
  INDEX `people_login` (`email`, `encrypted_password`, `salt`, `login_enabled`),
  INDEX `people_session` (`id`,`session`, `session_expiry`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `people_sessions` (  --TODO: rename as sme_people_sessions
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `people_id` int(11) NOT NULL, --TODO: rename as person_id
  `session` varchar(255) NOT NULL,
  `session_expiry` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (`id`),
  INDEX `people_sessions_session` (`session`, `session_expiry`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sme_tenants` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(255) NOT NULL DEFAULT '', 
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `trucking_trip_tickets` ( 
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `sme_company_id` int(11) NOT NULL, 
  `encoded_by_person_id` int(11) NOT NULL, 
  `date` datetime NOT NULL, 
  `serial_number` varchar(255) NOT NULL, 
  `trucking_source_id` int(11) NOT NULL, 
  `trucking_destination_id` int(11) NOT NULL, 
  `trucking_driver_id` int(11) NOT NULL, 
  `trucking_driver_helper_id` int(11) NOT NULL, 
  `trucking_truck_id` int(11) NOT NULL, 
  `sme_customer_id` int(11) NOT NULL, 
  `price` bigint(20) unsigned NOT NULL, 
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `sme_tenant_id` int(11) NOT NULL, 
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `trucking_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(255) NOT NULL DEFAULT '', 
  `sme_company_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



