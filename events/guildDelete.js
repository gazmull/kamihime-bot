// this event triggers when the bot is removed from a guild.

const   config    = require("../config.json");
const   logger    = require("../utils/logger").logger;
const   db          = require("../utils/dbconfig").pool;
const   moment      = require("moment-timezone");


exports.run = async (client, guild) => {
  logger.info(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  if(client.guilds.size > 1)
    client.user.setActivity(`${client.guilds.size} servers | ${config.prefix}help`, { type: 'WATCHING' });
  else
    client.user.setActivity(`${client.guilds.size} server | ${config.prefix}help`, { type: 'WATCHING' });

  try {
    const [rows, fields] = await db.execute('UPDATE `unions` SET `union_active`=0 WHERE `union_discord_guild_id` = ?', [guild.id]);
  } catch (err) {
    logger.error(err);
  }

}
