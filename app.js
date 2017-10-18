
const Discord     = require("discord.js");        // Load up the discord.js library
const fs          = require("fs");


// This is your client. Some people call it `bot`, some people call it `self`,
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");

// -------------------- event ready ----------------------

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  if(client.guilds.size > 1)
    client.user.setGame(`on ${client.guilds.size} servers`);
  else
    client.user.setGame(`on ${client.guilds.size} server`);
});

// -------------------- event guildCreate ----------------------

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

// -------------------- event guildDelete ----------------------

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

// -------------------- event message ----------------------

client.on("message", message => {
  // This event will run on every single message received, from any channel or DM.

  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Basic Command Handler
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }

});

client.login(config.token);
