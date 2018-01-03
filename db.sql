ALTER DATABASE `kamihime_bot` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_discord_id` bigint(20) NOT NULL,
  `user_nutaku_id` bigint(20) DEFAULT NULL,
  `user_username` varchar(64) DEFAULT NULL,
  `user_nickname` varchar(64) DEFAULT NULL,
  `user_discriminator` int(4) DEFAULT NULL,
  `user_created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `user_country_code` varchar(8) DEFAULT NULL,
  `user_timezone` varchar(64) DEFAULT NULL,
  `user_description` varchar(255) DEFAULT NULL,
  `user_waifu` varchar(255) DEFAULT NULL,
  `user_rep_point` int(8) DEFAULT '0',
  `user_last_given_rep` DATETIME  DEFAULT NULL,
  `user_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;