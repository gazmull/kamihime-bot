ALTER DATABASE `kamihime_bot` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_discord_id` bigint(20) NOT NULL,
  `user_nutaku_id` bigint(20) DEFAULT NULL,
  `user_username` varchar(64) DEFAULT NULL,
  `user_discriminator` int(4) DEFAULT NULL,
  `user_created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `user_updated_on` DATETIME DEFAULT NULL,
  `user_last_online` DATETIME DEFAULT NULL,
  `user_country_code` varchar(8) DEFAULT NULL,
  `user_timezone` varchar(64) DEFAULT NULL,
  `user_description` varchar(512) DEFAULT NULL,
  `user_lang` varchar(32) DEFAULT NULL,
  `user_waifu` varchar(255) DEFAULT NULL,
  `user_waifu_link` varchar(255) DEFAULT NULL,
  `user_level` int(8) DEFAULT '1',
  `user_rep_point` int(8) DEFAULT '0',
  `user_last_given_rep` DATETIME  DEFAULT NULL,
  `user_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  ADD UNIQUE(`user_discord_id`);

ALTER TABLE `users`
  ADD UNIQUE(`user_nutaku_id`);


########################
###### UNION TOOLS #####
########################

CREATE TABLE `unions` (
  `union_id` int(11) NOT NULL,
  `union_discord_guild_id` bigint(20) DEFAULT NULL,
  `union_discord_guild_name` varchar(255) DEFAULT NULL,
  `union_discord_owner_id` bigint(20) DEFAULT NULL,
  `union_discord_twitter_channel_id` bigint(20) DEFAULT NULL,
  `union_name` varchar(255) DEFAULT NULL,
  `union_created_on` DATETIME DEFAULT NULL,
  `union_updated_on` DATETIME DEFAULT NULL,
  `union_description` varchar(512) DEFAULT NULL,
  `union_active` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `unions`
  ADD PRIMARY KEY (`union_id`);

ALTER TABLE `unions`
  MODIFY `union_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `unions`
  ADD UNIQUE(`union_discord_guild_id`);


ALTER TABLE `users` ADD `user_discord_union_id` bigint(20) DEFAULT NULL AFTER `user_discriminator`;
ALTER TABLE `users` ADD `user_nutaku_role` ENUM('None','Member','Officer','Subleader','Leader') NOT NULL DEFAULT 'None' AFTER `user_nutaku_id`;
