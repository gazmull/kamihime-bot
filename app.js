const Discord     = require("discord.js");        // Load up the discord.js library
const fs          = require("fs");
const persist     = require("./utils/persist").persist;
const {
  owners,       // An Array of Owners' IDs
  discord_code, // Your server's permanent invite code
  token,        // Your bot's token
  quiz,         // Quiz property
  prefix        // Your bot's prefix
}                 = require("./config.json");     // This is your configuration file, see an example on "config.sample.json"

// --- Client Class Extension for Utilities
class KamihimeClient extends Discord.Client {
  constructor(options) {
    super(options);
    this.clearDialog = require('./utils/clearDialog');
    this.awaitSelection = require('./utils/khEmbeds/awaitSelection');
    this.logger = require('./utils/logger').logger;
    this.awaitingUsers = new Discord.Collection();
  }
}

// This is your client. Some people call it `bot`, some people call it `self`,
const client = new KamihimeClient({
  disabledEvents: ['TYPING_START'],
  disableEveryone: true
});

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


  // --- special case: User is on the baka list

  persist.get('bakas').then((bakas) => {
    if (bakas.indexOf(message.author.id)>-1) {
      try {
        let kbaka = require(`./commands/kbaka.js`);
        kbaka.insult(client, message);
      } catch (err) {
        console.error(err);
      }
    }
  });


  // --- special case: Channel for the quiz game

  if (quiz)
  {
    if (message.channel.id == quiz.channel_id) {
      try {
        let quiz = require(`./functions/quiz.js`);
        quiz.read_answer(client, message);
      } catch (err) {
        console.error(err);
      }
      // prevent uses of bot commands in the game quiz channel
      //return;
    }
  }

  // --- Basic Command Handler

  if(message.content.indexOf(prefix) !== 0) return;
  // Here we separate our "command" name, and our "arguments" for the command.
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    if (!fs.existsSync(`./commands/${command}.js`)) return;
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    message.channel.send(
      `Sorry, something happened: \`${err.message}\`\n\n`
      + `If this is a feature-breaking issue, please contact: `
      + `${owners ? owners.map(o => `\`${client.users.get(o).tag}\``).join(', ') : 'No bot developers were in the configuration'}\n`
      + `Or proceed to this Discord invite code: \`${discord_code ? discord_code : 'No invite code was in the configuration'}\``
    );
    client.logger.error(err);
  }

});

client.login(token);
