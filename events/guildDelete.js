// this event triggers when the bot is removed from a guild.

exports.run = (client, guild) => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
}
