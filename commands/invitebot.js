// Provide a link for bot easy install on other Discord server
// Permissions: 3072 (Read messages / Send messages) see: https://discordapi.com/permissions.html

const Discord     = require("discord.js");
const config      = require("../config.json");
const permissions = 289856;

exports.run = (client, message, args) => {

  const botUser = client.user;

  let avatarURL = botUser.avatarURL;
  if ( avatarURL == null) {
    avatarURL = config.thumbrooturl+"\/images_bot\/default_avatar.png";
  }

  const embed = new Discord.RichEmbed()
  .setTitle("Click here to add the "+botUser.username+" bot to your own server")
  .setAuthor(botUser.username+" Bot:")
  .setThumbnail(avatarURL)
  .setColor("#00AE86");

  const description = "Please, ensure you have the 'Manage server' role on your discord server to allow installation.\n";
  embed.setDescription(description);
  embed.setURL("https:\/\/discordapp.com/oauth2/authorize?client_id="+client.user.id+"&scope=bot&permissions="+permissions);
  message.channel.send({embed});

}
