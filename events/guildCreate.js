// This event triggers when the bot joins a guild.

const   config      = require("../config.json");
const   logger      = require("../utils/logger").logger;
const   db          = require("../utils/dbconfig").pool;
const   moment      = require("moment-timezone");
const   ku          = require("../commands/ku");
const   kp          = require("../commands/kp");

exports.run = async (client, guild) => {
  logger.info(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`${client.guilds.size} servers | ${config.prefix}help`, { type: 'WATCHING' });

  // Add the guild owner to the user database

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [guild.ownerID]);
    if (!rows.length) {
      kp.createProfile(guild.owner.user);
    }
  } catch (err) {
    logger.error(err);
  }

  // Add the guild to the union database

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guild.id]);
    if (!rows.length) {
      ku.createUnion(guild);
    }
    else {
      try {
        const [rows, fields] = await db.execute('UPDATE `unions` SET `union_active`=1 WHERE `union_discord_guild_id` = ?', [guild.id]);
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    logger.error(err);
  }

}
