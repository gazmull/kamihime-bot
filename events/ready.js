// This event will run if the bot starts, and logs in, successfully.

const config  = require("../config.json");
const khinfos = require("../khinfos.js");
const quiz   = require("../quiz.js");

exports.run = (client) => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  if(client.guilds.size > 1)
    client.user.setGame(`on ${client.guilds.size} servers`);
  else
    client.user.setGame(`on ${client.guilds.size} server`);

  khinfos.initKHInfos();

  if (config.quiz_channel_id) {
    quiz.init_question(client);
  }

}
