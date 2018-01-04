// Search & Display user profile, or Update your own Profile

const   discord     = require("discord.js");
const   config      = require("../config.json");
const   db          = require("../dbconfig.js").pool;
const   moment      = require("moment-timezone");
const   momentZones = require('moment-timezone/data/meta/latest.json');

const   khinfos     = require("../khinfos.js");
const   fuzzy     = require('fuzzy');
const   khArray  = khinfos.getKHInfos();

const   defaultDescription = "Here is your default description. Use the command '"+config.prefix+"help profile' for the list of functions available to edit your profile.";

var fuzzyOptions = {
  extract: function(el) { return el.name; }
};


exports.run     = (client, message, args) => {

  // ============ process the 'set' command

  if (args[0]=="set")
  {
    if (message.channel.type!="dm") {
        message.channel.send("The response had been sent to you by direct message.");
        message.author.send("```To limit spam in text channels, updating profile is always redirected here.\nIf you need help, use '"+config.prefix+"help profile'.\nYour last command was '"+message.content+"' and my response is:```");
    }

    const dateUpdated = moment().format("YYYY-MM-DD HH:mm:ss");

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
          let timeZonesMessage = "There is more than one timezone available for your country, please select the desired timezone from the list below using the command:\n";
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

      db.execute('UPDATE `users` SET `user_country_code`=?, `user_timezone`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [countrycode, timezones[timezoneIdx], dateUpdated, message.author.id],
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

      db.execute('UPDATE `users` SET `user_description`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [description, dateUpdated, message.author.id],
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
        message.author.send("please provide your Nutaku game Id");
        return;
      }

      const gid = parseInt(args[2]);
      if (gid<=0) {
        message.author.send(args[2]+" is not a valid game Id.");
        return;
      }
      db.execute('UPDATE `users` SET `user_nutaku_id`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [gid, dateUpdated, message.author.id],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            message.author.send("Error updating Nutaku game Id");
            return;
          }
          message.author.send("Nutaku game Id set to: "+gid);
        }
      );
      return;
      break;

      // ------------ Level ----------

      case "level":
      if(!args[2]) {
        message.author.send("please provide your current game level");
        return;
      }

      const level = parseInt(args[2]);
      if (level<=0) {
        message.author.send(args[2]+" is not a valid level.");
        return;
      }
      db.execute('UPDATE `users` SET `user_level`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [level, dateUpdated, message.author.id],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            message.author.send("Error updating game level");
            return;
          }
          message.author.send("Game level set to: "+level);
        }
      );
      return;
      break;


      // ------------ Languages ----------

      case "lang":
      if(!args[2]) {
        message.author.send("please provide the languages you're used to.");
        return;
      }
      const lang = args.join(" ").slice(args[0].length+args[1].length+2);

      db.execute('UPDATE `users` SET `user_lang`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [lang, dateUpdated, message.author.id],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            message.author.send("Error updating Language");
            return;
          }
          message.author.send("Language set to: "+lang);
        }
      );
      return;
      break;

      // ------------ Online habit ----------

      case "online":
      if(!args[2]) {
        message.author.send("please provide your game habits.");
        return;
      }
      const online = args.join(" ").slice(args[0].length+args[1].length+2);

      db.execute('UPDATE `users` SET `user_online_habit`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [online, dateUpdated, message.author.id],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            message.author.send("Error updating Online habits");
            return;
          }
          message.author.send("Online habit set to: "+online);
        }
      );
      return;
      break;

      // ------------ Waifu ----------

      case "waifu":
      if(!args[2]) {
        message.author.send("please provide a character name (Kamihime, Soul or Eidolon).");
        return;
      }
      const waifu = args.join(" ").slice(args[0].length+args[1].length+2);

      var khfound   = false;
      if (waifu.length < 2)
      {
        message.channel.send("You must enter at least two letters.");
        return;
      }

      var results = fuzzy.filter(waifu, khArray, fuzzyOptions);
      var khItems = results.map(function(el) { return el.original; });
      if (khItems.length)
      {
        const foundWaifu = khItems[0].name;
        if(khItems[0].objectType == "Weapon") {
          message.author.send("Sorry, but your request matches '"+foundWaifu+"' , and it's a weapon...");
          return;
        }
        const waifuLink      = config.wikidomain+khItems[0].link;

        db.execute('UPDATE `users` SET `user_waifu`=?, `user_waifu_link`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [foundWaifu, waifuLink, dateUpdated, message.author.id],
          function(err, results, fields) {
            if (err) {
              console.log(err);
              message.author.send("Error updating your favorite character");
              return;
            }
            message.author.send("Favorite character set to: '"+foundWaifu+"'");
          }
        );
        return;
      }
      else {
        message.author.send("No character matches your request "+waifu);
        return;
      }


      break;


      // ------------ Default: Nothing found ----------

      default:
      if (args[1]) {
        message.author.send("'"+args[1]+"' Unknown set profile function. Please use '"+config.prefix+"help profile' for more infos.");
      }
      else {
        message.author.send("No function given for your set profile command. Please use '"+config.prefix+"help profile' for more infos.");
      }
      return;
      break;
    }

  }

  // ============ No special command : fallling back to the default display profile

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

  db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id],
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
        db.execute('INSERT INTO `users` (`user_discord_id`, `user_username`, `user_discriminator`, `user_description`) VALUES(?,?,?,?)', [user.id, user.username, user.discriminator, defaultDescription],
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

  const unionName     = "UnionName PlaceHolder";
  const unionRole     = "coming soon"
  const unionInvite   = "https://discord.gg/VeB4gjF";


  const createdDate   = moment(profileInfos['user_created_on']).format("MMMM DD YYYY");
  let updatedDate     = "Never, this is the defaut profile";

  if (profileInfos['user_updated_on']) {
    updatedDate     = moment(profileInfos['user_updated_on']).format("MMMM DD YYYY HH:mm:ss");
  }


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

  reputationText = "None reveived";
  if (profileInfos['user_rep_point']==1) {
    reputationText = "1 point received";
  }
  if (profileInfos['user_rep_point']>1) {
    reputationText = profileInfos['user_rep_point']+" points received";
  }

  let userLang = "English";
  if (profileInfos['user_lang']) {
    userLang = profileInfos['user_lang'];
  }

  let onlineHabit = "Not specified";
  if (profileInfos['user_online_habit']) {
    onlineHabit = profileInfos['user_online_habit'];
  }

  let waifu = "None";
  if (profileInfos['user_waifu']) {
    waifu = profileInfos['user_waifu'];
  }
  if (profileInfos['user_waifu_link']) {
    waifu = "["+waifu+"]("+profileInfos['user_waifu_link']+")";
  }
  
  const embed = new discord.RichEmbed()
  embed.setTitle(":regional_indicator_u: "+unionName+" ["+unionRole+"]");
  embed.setAuthor("Name: "+profileInfos['fullUserName'], "");
  embed.setColor("#00AE86");
  embed.setDescription("```\n"+profileInfos['user_description']+"```");
  embed.setThumbnail(user.avatarURL);

  embed.addField(":timer: Profile created:", createdDate, true);
  embed.addField(":military_medal: Reputation points", reputationText, true);
  embed.addField(":arrow_up: Player Level:", "Level "+profileInfos['user_level'], true);
  embed.addField(":id: Game Player ID:", nutakuID, true);
  embed.addField(":speech_left: Spoken Language:", userLang ,true);
  embed.addField(countryFlag+" Country & Local Time:", localTime, true);
  embed.addField(":heart: Favorite character:",waifu, true);
  embed.addField(":hourglass: Online habits:", onlineHabit ,true);

  embed.setFooter("Last time updated: "+updatedDate,"");

  if (unionInvite){
    embed.setURL(unionInvite);
  }

  message.channel.send({embed});

}
