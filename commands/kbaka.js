// Search & Display user profile, or Update your own Profile

const   discord     = require("discord.js");
const   config      = require("../config.json");
const   insults     = require('../datas/insults.json');
const   persist     = require("../utils/persist").persist;
const   logger      = require("../utils/logger").logger;

exports.run     = (client, message, args) => {


  if(!config.kbaka_authorized_users.includes(message.author.id))
    return message.reply("Sorry, you don't have permissions to use this!");

  if (args.length==0){
    message.channel.send("Please provide a username using the @username argument.");
    return;
  }
  else {
    userSearch    = args.join(" ");
    searchId = userSearch.slice(2, -1);
    if( searchId.charAt(0) === "!") {
      searchId = searchId.substr(1);
    }
  }

  // --- Try to match a user

  if (message.channel.type=="dm") {
    // dm channel
    message.channel.send("Sorry, kbaka is not possible on direct message. You need to be on a text channel to do that.");
    return;
  }

  user = client.users.get(searchId);
  if (!user) {
    message.channel.send("Sorry, no profile found for '"+userSearch+"' on this Discord server.\nDon't forget to add @ before the username.");
    return;
  }

  /*if (message.author.id == user.id) {
    message.channel.send("Sending kbaka to yourself is not allowed...");
    return;
  }*/

  const userId = user.id;

  persist.get('bakas').then((bakas) => {

    var userIndex = bakas.indexOf(user.id);
    if(userIndex > -1 ) {
      bakas.splice(userIndex, 1);
      message.channel.send ("Removing "+user.username+" from the baka list.");
    }
    else {
      bakas.push(user.id);
      message.channel.send ("Adding "+user.username+" to the baka list.");
    }
    persist.set('bakas', bakas);

  });

}

// ------------------------------------------------------------

exports.insult     = (client, message ) => {

  const thumb = config.thumbrooturl+"\/images_bot\/AlyssaPortrait.jpg";

  const embed = new discord.RichEmbed()
  .setAuthor("Alyssa:")
  .setThumbnail(thumb)
  .setColor("#00AE86");

  const insult = insults.insult[Math.floor(Math.random()*insults.insult.length)];

  embed.setDescription(insult);
  message.channel.send({embed});

}
