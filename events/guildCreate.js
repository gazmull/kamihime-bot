// This event triggers when the bot joins a guild.

const   logger      = require("../logger.js").logger;

exports.run = (client, guild) => {
  logger.info(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`${client.guilds.size} servers`, { type: 'WATCHING' });
}
