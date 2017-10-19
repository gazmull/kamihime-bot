const Discord     = require("discord.js");        // Load up the discord.js library
const fs          = require("fs");


// This is your client. Some people call it `bot`, some people call it `self`,
const client = new Discord.Client();
// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");


// -------------- This loop reads the /events/ folder and attaches each event file to the appropriate event.

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
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
