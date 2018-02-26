// This event triggers when a member leave a guild.

const config = require("../config.json");
const db = require("../utils/dbconfig").pool;
const moment = require("moment-timezone");
const kp = require("../commands/kp");
const logger = require("../utils/logger").logger;

exports.run = async (client, member) => {
  let guild = member.guild;
  logger.info('A member left the guild ' + guild.name + ': username: ' + member.user.username + ' userId: ' + member.user.id)

  // update guild memberCount
  try {
    const [results, fields] = await db.execute('UPDATE `unions` SET `union_discord_nb_member`=? WHERE `union_discord_guild_id`=?', [guild.memberCount, guild.id]);
    logger.info("Guild memberCount updated: " + guild.name + " - memberCount: " + guild.memberCount);
  } catch(err) {
    logger.error(err);
  }

}
