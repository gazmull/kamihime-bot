// This event triggers when the bot joins a guild.

const   logger      = require("../utils/logger").logger;

exports.run = (client, guild) => {
  logger.info(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`${client.guilds.size} servers | ${config.prefix}help`, { type: 'WATCHING' });
}
