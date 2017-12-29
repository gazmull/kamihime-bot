// Return the n latest updates for Kamihimes Eidolons Weapons & Souls

const   discord   = require("discord.js");
const   config    = require("../config.json");
const   khinfos   = require("../khinfos.js");
const   countdown = require("countdown");         // http://countdownjs.org
const   moment    = require("moment-timezone");            // https://momentjs.com/
const   mysql     = require('mysql2');

const   dataArray = khinfos.getKHInfos();
const   khArray   = khinfos.getKamihimeInfos();
const   edArray   = khinfos.getEidolonInfos();
const   slArray   = khinfos.getSoulInfos();
const   wpArray   = khinfos.getWeaponInfos();

exports.run     = (client, message, args) => {

  // process set commands

  if (args[0]=="set")
  {
    switch (args[1]) {

      case "favorite":
      break;

      case "description":
      message.channel.send("set description command.");
      return;
      break;

      default:
      message.channel.send("unknown command.");
      return;
      break;
    }
  }

  // no special command : fallling back to display profile

  let userSearch    = null;
  let user          = null;
  let fullUserName  = null;
  let nickName      = null;

  let timezone      = "America/Los_Angeles";

  let unionName     = "UnionName";
  let unionRole     = "SubLeader"
  let unionInvite   = "https://discord.gg/VeB4gjF";

  // format the user request.

  if (args.length==0){
    userSearch    = message.author.username;
  }
  else {
    userSearch    = args.join(" ");
    //if( userSearch.charAt(0) === "@") {
    //  userSearch = userSearch.substr(1);
    //}
  }

  //console.log ("|"+userSearch+"|");

  // Try to match the user (Own profile only in Direct message, Everything in Text channels using nickname then username)

  if (message.channel.type=="dm") {

    // dm channel
    if( userSearch !=  message.author.username) {
      console.log(message);
      message.channel.send("Sorry, only your own profile is supported on direct message.");
      return;
    }
    else {
      user = client.users.get(message.author.id);
    }
  }
  else {

    // text channels

    let guildUser = message.member.guild.members.find('nickname' , userSearch);   // search by nickname first
    if (guildUser) {
      user = guildUser.user;
      if (user){
        nickName = guildUser.nickname;
      }
    }
    else {
      user = client.users.find('username', userSearch);     // search by username
      if (user){
        guildUser = message.guild.members.get(user.id);
        if (guildUser) {
          nickName = guildUser.nickname;
        }
      }
    }
  }

  if (user) {
    if(nickName){
      fullUserName  = nickName+" / "+user.username;
    }
    else {
      fullUserName = user.username;
    }
  }
  else {
   message.channel.send("Sorry, no profile found for '"+userSearch+"' in this Discord server.\nThe search criteria must be exact and is case sensitive.");
   return;
  }

  var connection = mysql.createConnection({
    host     : config.mysql.host,
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
  });

  connection.connect();
  connection.query('SELECT * FROM employees', function(err, rows, fields)
  {
    if (err) throw err;
    //console.log(rows[0]);
  });
  connection.end();


  // Display the profile using RichEmbed

  let localTime = "Not provided";
  if (moment.tz.zone(timezone)) {
    localTime = moment().tz(timezone).format("ddd, hh:mm A");
  }

  const embed = new discord.RichEmbed()
  embed.setTitle(":regional_indicator_u: "+unionName+" ["+unionRole+"]");
  embed.setAuthor("Username: "+fullUserName, "");
  embed.setColor("#00AE86");
  embed.setDescription("*Here is your default profile. Use the command '/help profile' for the list of commands available to edit your informations.*");
  embed.setThumbnail(user.avatarURL);
  embed.addField(":timer: Profile created:","   2018-01-12",true);
  embed.addField(":id: Game Player ID:","3770259",true);
  embed.addField(":earth_africa: Local Time:",localTime,true);
  embed.addField(":speech_left: Spoken Language:","English, Français",true);
  embed.addField(":heart: Favorite character:","[charName](http://foo.com/bar)",true);
  embed.addField(":military_medal: Reputation points","3 points", true);

  if (unionInvite){
    embed.setURL(unionInvite);
  }

  message.channel.send({embed});
}
