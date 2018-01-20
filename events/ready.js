// This event will run if the bot starts, and logs in, successfully.

const config  = require("../config.json");
const khinfos = require("../utils/khinfos");
const quiz    = require("../functions/quiz");
const twitter = require("../functions/twitter");
const logger  = require("../utils/logger").logger;


exports.run = (client) => {
  logger.info(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  if(client.guilds.size > 1)
    client.user.setActivity(`${client.guilds.size} servers | ${config.prefix}help`, { type: 'WATCHING' });
  else
    client.user.setActivity(`${client.guilds.size} server | ${config.prefix}help`, { type: 'WATCHING' });

  twitter.init(client);

  khinfos.initKHInfos();

  if (config.hasOwnProperty('quiz')) {
    quiz.init_question(client);
  }

}
