// this event triggers when the bot is removed from a guild.

const logger  = require("../logger.js").logger;

exports.run = (client, guild) => {
  logger.info(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  if(client.guilds.size > 1)
    client.user.setActivity(`${client.guilds.size} servers`, { type: 'WATCHING' });
  else
    client.user.setActivity(`${client.guilds.size} server`, { type: 'WATCHING' });
}
