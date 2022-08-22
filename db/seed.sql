INSERT INTO `sme_tenants` (`name`) VALUES ('KlaudSol Philippines, Inc.');

INSERT INTO `companies` (`id`, `name`) VALUES (1, 'KlaudSol Philippines, Inc.');


INSERT INTO `people` (`id`, `first_name`, `last_name`, `company_position`, `email`, `encrypted_password`, `salt`, `company_id`, `login_enabled`) VALUES
(1, 'System', 'Administrator', 'System Administrator', 'admin@klaudsol.com', SHA2(CONCAT('ratmaxi8', 'saltbae'), 256), 'saltbae', 1,1);