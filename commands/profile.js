// Return the n latest updates for Kamihimes Eidolons Weapons & Souls

const   discord = require("discord.js");
const   config  = require("../config.json");
const   khinfos = require("../khinfos.js");

const   dataArray = khinfos.getKHInfos();
const   khArray   = khinfos.getKamihimeInfos();
const   edArray   = khinfos.getEidolonInfos();
const   slArray   = khinfos.getSoulInfos();
const   wpArray   = khinfos.getWeaponInfos();

exports.run     = (client, message, args) => {

  if (args[0]=="set")
  {
    switch (args[1]) {

      case "union":
      break;

      case "waifu":
      break;

      case "description":
      break;

      case "description":
      break;
    }

    if (args[1]=="union")
    {
      message.channel.send("union command");
    }
  }

  // no matching : Display a profile

  let userName    = null;

  if (args.length==0){
    userName    = message.author.username;
  }
  else {
    userName    = args.join(" ");;
  }

  //console.log(userName);

  let user          = null;
  let fullUserName  = null;
  let unionName     = "UnionName";
  let unionInvite   = "https://discord.gg/VeB4gjF";

  const guildUser = message.member.guild.members.find('nickname' , userName);
  if (guildUser) {
    user          = guildUser.user;
    if (user){
      fullUserName  = user.username+" ("+guildUser.nickname+")";
    }
  }
  else {
    user = client.users.find('username', userName);
    if (user){
      fullUserName  = user.username;
    }
  }

  //console.log(guildUser);

  if (!user) {
   message.channel.send("Sorry, no profile found for '"+userName+"'.\nThe search criteria must be exact and is case sensitive.");
   return;
  }


  const embed = new discord.RichEmbed()
  embed.setTitle(":regional_indicator_u: Union: "+unionName);
  embed.setAuthor("Username: "+fullUserName, "");
  embed.setColor("#00AE86");
  embed.setDescription("*Et est admodum mirum videre plebem innumeram mentibus ardore quodam infuso cum dimicationum curulium eventu pendentem. haec similiaque memorabile nihil vel serium agi Romae permittunt. ergo redeundum ad textum.*");
  embed.setThumbnail(user.avatarURL);

  embed.addField("Timezone:","GMT+1",false);
  embed.addField("Language spoken:",":flag_gb:",false);

  if (unionInvite){
    embed.setURL(unionInvite);
  }

  message.channel.send({embed});
}
