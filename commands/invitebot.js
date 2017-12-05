// The usual help command
// Display a Welcome text and all the avaialable commands

const Discord = require("discord.js");
const config  = require("../config.json");


exports.run = (client, message, args) => {
  const query = args.join(" ");

  var thumb = config.thumbrooturl+"\/images_bot\/BotPortrait.png";
  var image = config.thumbrooturl+"\/images_bot\/BotInstall.png";

  const embed = new Discord.RichEmbed()
  .setTitle("Click here to add the kamihime bot to your own server")
  .setAuthor("Kamihime Bot:")
  .setThumbnail(thumb)
  .setColor("#00AE86");

  var description = "Please, ensure you have the 'Manage server' role on your discord server to allow installation.\n";
  embed.setDescription(description);

  embed.setURL("https:\/\/discordapp.com/oauth2/authorize?client_id=371779857694326785&scope=bot&permissions=3072");
  //embed.setImage(image);
  message.channel.send({embed});

}
