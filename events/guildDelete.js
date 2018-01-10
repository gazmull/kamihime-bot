// this event triggers when the bot is removed from a guild.

const logger  = require("../logger.js").logger;

exports.run = (client, guild) => {
  logger.info(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
}
