// Search & Display user profile, or Update your own Profile

const   discord     = require("discord.js");
const   config      = require("../config.json");
const   moment      = require("moment-timezone");
const   mysql       = require('mysql2');

const   momentZones = require('moment-timezone/data/meta/latest.json');

const   defaultDescription = "Here is your default description. Use the command '/help profile' for the list of functions available to edit your profile.";


exports.run     = (client, message, args) => {

  const connection = mysql.createConnection({
    host     : config.mysql.host,
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
  });

  // process set commands

  if (args[0]=="set")
  {

    if (message.channel.type!="dm") {
        message.channel.send("Profile edition command: Output redirected to direct message as antispam measure.");
        message.author.send("```To avoid spam, updating your profile is only allowed here. If you need help, use '/help profile'.\nYour last command was '"+message.content+"' and my response is:```");
    }

    switch (args[1]) {

      // ------------ Country ----------

      case "country":
      if(!args[2]) {
        message.author.send("please provide your 2 letters country code");
        return;
      }

      let countrycode = args[2].toUpperCase();
      let timezoneIdx = parseInt(args[3]);
      let timezones    = getCountryZones(countrycode);


      if (!timezones){
        message.author.send(countrycode+" is not a valid country code (2 letters), for a full list of supported country codes, visit https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2");
        return;
      }

      if (timezones.length>1) {
        if (!timezoneIdx) {
          let timeZonesMessage = "There is more than one timezone available for your country, please select the desired timezone from the list bellow using the command:\n";
          timeZonesMessage    += "/profile set country "+countrycode+" [timeZoneNumber] ";
          timeZonesMessage    += "( exemple: /profile set country "+countrycode+" 1 )\n\n";
          timeZonesList       = "";
          for (i=0;i<timezones.length;i++) {
            timeZonesList  +=(i+1)+" - "+timezones[i]+"\n";
          }
          message.author.send(timeZonesMessage+"```"+timeZonesList+"```");
          return;
        }
        else {
          if (timezoneIdx>timezones.length) {
            message.author.send("The timezone number "+timezoneIdx+" is not available for your country.");
            return;
          }
          timezoneIdx--;
        }
      }
      else {
        timezoneIdx = 0;
      }

      if (!moment.tz.zone(timezones[timezoneIdx])) {
        message.author.send(timezones[timezoneIdx]+" is not a valid timezone");
        return;
      }

      connection.execute('UPDATE `users` SET `user_country_code`=?, `user_timezone`=? WHERE `user_discord_id`=?', [countrycode, timezones[timezoneIdx], message.author.id],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            message.author.send("Error updating country or timezone");
            return;
          }
          message.author.send("Country set to '"+countrycode+"' and timezone set to '"+timezones[timezoneIdx]+"'");
        }
      );
      return;
      break;

      // ------------ Description ----------

      case "desc":
      if(!args[2]) {
        message.author.send("please provide a description text");
        return;
      }
      const description = args.join(" ").slice(args[0].length+args[1].length+2);

      const lines = description.split("\n");
      if (lines.length>15) {
        message.author.send("Description is limited to 15 lines max.");
        return;
      }

      connection.execute('UPDATE `users` SET `user_description`=? WHERE `user_discord_id`=?', [description, message.author.id],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            message.author.send("Error updating description");
            return;
          }
          message.author.send("description profile set to: ```\n"+description+"```");
        }
      );
      return;
      break;

      // ------------ Game Id ----------

      case "gid":
      if(!args[2]) {
        message.author.send("please provide your Nutaku game id");
        return;
      }
      return;
      break;

      // ------------ Languages ----------

      case "lang":
      if(!args[2]) {
        message.author.send("please provide the languages you're used to.");
        return;
      }
      return;
      break;

      // ------------ Default: Nothing found ----------

      default:
      if (args[1]) {
        message.author.send("'"+args[1]+"' Unknown set profile function. Please use '/help profile' for more infos.");
      }
      else {
        message.author.send("No function given for your set profile command. Please use '/help profile' for more infos.");
      }
      return;
      break;
    }

  }

  // --- No special command : fallling back to the default display profile

  let userSearch    = null;
  let searchId      = null;
  let useNickname   = false;
  let user          = null;
  let fullUserName  = null;
  let nickName      = null;

  // --- Format the user search request

  if (args.length==0){
    userSearch    = message.author.username;
    searchId      = message.author.id;
    useNickname   = true;
  }
  else {
    userSearch    = args.join(" ");
    searchId = userSearch.slice(2, -1);
    if( searchId.charAt(0) === "!") {
      useNickname = true;
      searchId = searchId.substr(1);
    }
  }

  // --- Try to match a user (Own profile only in Direct message, Everything in Text channels using @shortcut)

  if (message.channel.type=="dm") {
    // dm channel
    if( userSearch !=  message.author.username) {
      message.channel.send("Sorry, searching @username is related to a memberlist, it's not possible on direct message. You need to be on a text channel to search for a user.");
      return;
    }
    else {
      user = client.users.get(searchId);
    }
  }
  else {
    // text channels
    user = client.users.get(searchId);
    if (user && useNickname){
      guildUser = message.guild.members.get(user.id);
      if (guildUser) {
        nickName = guildUser.nickname;
      }
    }
  }
  if (!user) {
    message.channel.send("Sorry, no profile found for '"+userSearch+"' on this Discord server.\nDon't forget to add @ before the username.");
    return;
  }

  // --- Build user fullname

  if(nickName){
    fullUserName  = nickName+" / "+user.username;
  }
  else {
    fullUserName = user.username;
  }

  // --- Get additionnal user info from database (or store the new profile if not available)

  connection.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id],
    function(err, rows, fields) {
      if (err) {
        console.log(err);
        message.channel.send("Error reading profile");
        return;
      }
      if (rows.length) {
        //console.log(results[0]); // results contains rows returned by server
        rows[0]['fullUserName'] = fullUserName;
        displayprofile(message, rows[0], user);
      }
      else {
        connection.execute('INSERT INTO `users` (`user_discord_id`, `user_username`, `user_discriminator`, `user_description`) VALUES(?,?,?,?)', [user.id, user.username, user.discriminator, defaultDescription],
          function(err, results, fields) {
            if (err) {
              console.log(err);
              message.channel.send("Error creating profile");
              return;
            }
            message.channel.send("profile created");
          }
        );
      }
    }
  );
}

// ==================== Get Timezones by countryCode ============

function getCountryZones(countrycode) {
  if (!countrycode) {
    return null;
  }
  countrycode = countrycode.toUpperCase();
  return momentZones.countries[countrycode] && momentZones.countries[countrycode].zones;
}

// ==================== Display a Formatted profile ============


function displayprofile(message, profileInfos, user) {

  let unionName     = "UnionName PlaceHolder";
  let unionRole     = "coming soon"
  let unionInvite   = "https://discord.gg/VeB4gjF";


  let createdDate   = moment(profileInfos['user_created_on']).format("MMMM DD YYYY");

  let countryFlag = ":earth_africa:";
  let localTime   = "Not provided";
  let countrycode = profileInfos['user_country_code'];
  let timezone    = profileInfos['user_timezone'];

  if (moment.tz.zone(timezone)) {
    localTime = moment().tz(timezone).format("ddd, HH:mm");
    countryFlag = ":flag_"+countrycode.toLowerCase()+":";
  }

  let nutakuID = "Not provided";
  if (profileInfos['user_nutaku_id']){
    nutakuID = profileInfos['user_nutaku_id'];
  }

  const embed = new discord.RichEmbed()
  embed.setTitle(":regional_indicator_u: "+unionName+" ["+unionRole+"]");
  embed.setAuthor("Name: "+profileInfos['fullUserName'], "");
  embed.setColor("#00AE86");
  embed.setDescription("```\n"+profileInfos['user_description']+"```");
  embed.setThumbnail(user.avatarURL);
  embed.addField(":timer: Profile created:", createdDate, true);
  embed.addField(":id: Game Player ID:", nutakuID, true);
  embed.addField(countryFlag+" Country & Local Time:", localTime, true);
  embed.addField(":speech_left: Spoken Language:","English, Français",true);
  embed.addField(":heart: Favorite character:","[charName](http://foo.com/bar)",true);
  embed.addField(":military_medal: Reputation points",profileInfos['user_rep_point']+" point(s)", true);
  embed.setFooter("Last update: "+createdDate,"");

  if (unionInvite){
    embed.setURL(unionInvite);
  }

  message.channel.send({embed});

}
