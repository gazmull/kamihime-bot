// Search & Display user profile, or Update your own Profile

const   discord     = require("discord.js");
const   config      = require("../config.json");
const   db          = require("../utils/dbconfig").pool;
const   moment      = require("moment-timezone");
const   momentZones = require('moment-timezone/data/meta/latest.json');
const   khinfos     = require("../utils/khinfos");
const   fuzzy       = require('fuzzy');
const   logger      = require("../utils/logger").logger;

khinfos.initKHInfos();        // todo: Fixed the init placed in events.
const   khArray     = khinfos.getKHInfos();

const   defaultDescription = "This is the default description. Use the command '"+config.prefix+"help kp' for the list of functions available to edit your profile.";

var fuzzyOptions = {
  extract: function(el) { return el.name; }
};

exports.createProfile     = (user) => {
  createNewProfile(user);
}

exports.run     = (client, message, args) => {

  // ============ process the 'set' command

  if (args[0]=="set")
  {
    if (message.channel.type!="dm") {
        message.channel.send("The response had been sent to you by direct message.");

        let spamMessage    = "```css\nTo limit spam in text channels, updating profiles will be redirected to direct messages.\n";
        spamMessage       += "[Please type your next update commands here.]\n";
        spamMessage       += "[Do not use text channels for updating your profile.]\n";
        spamMessage       += "If you need help, type '"+config.prefix+"help kp'.```";
        spamMessage       += "```\nYour last command was '"+message.content+"' and my response is:```";

        message.author.send(spamMessage);
    }

    const dateUpdated = moment().format("YYYY-MM-DD HH:mm:ss");

    switch (args[1]) {

      // ------------ Country ----------

      case "country":
      if(!args[2]) {
        message.author.send("Please provide your 2 letters country code. (example: '"+config.prefix+"kp set country us' )\nFor a full list of supported country codes, visit https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements");
        return;
      }

      let countrycode = args[2].toUpperCase();
      let timezoneIdx = parseInt(args[3]);
      let timezones    = getCountryZones(countrycode);

      if (!timezones){
        message.author.send(countrycode+" is not a valid country code (2 letters)\nFor a full list of supported country codes, visit https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements");
        return;
      }

      if (timezones.length>1) {
        if (!timezoneIdx) {
          let timeZonesMessage = "There is more than one timezone available for your country, please select the desired timezone from the list below using the command:\n";
          timeZonesMessage    += "/profile set country "+countrycode+" [timeZoneNumber] ";
          timeZonesMessage    += "( example: /profile set country "+countrycode+" 1 )\n\n";
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
            logger.error(err);
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
            logger.error(err);
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
        message.author.send("Please, provide your Nutaku game Id");
        return;
      }

      const gid = parseInt(args[2]);

      if (gid<=0 || isNaN(args[2])) {
        message.author.send(args[2]+" is not a valid game Id.");
        return;
      }
      db.execute('UPDATE `users` SET `user_nutaku_id`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [gid, dateUpdated, message.author.id],
        function(err, results, fields) {
          if (err) {
            logger.error(err);
            message.author.send("Error updating Nutaku game Id: "+gid);
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
      if (level<=0 || isNaN(args[2])) {
        message.author.send(args[2]+" is not a valid level.");
        return;
      }
      db.execute('UPDATE `users` SET `user_level`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [level, dateUpdated, message.author.id],
        function(err, results, fields) {
          if (err) {
            logger.error(err);
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
            logger.error(err);
            message.author.send("Error updating Language");
            return;
          }
          message.author.send("Language set to: "+lang);
        }
      );
      return;
      break;

      // ------------ Waifu ----------

      case "fav":
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
              logger.error(err);
              message.author.send("Error updating your favorite character");
              return;
            }
            message.author.send("Favorite character set to: '"+foundWaifu+"'");
          }
        );
        return;
      }
      else {
        message.author.send("No character matches your request '"+waifu+"'");
        return;
      }


      break;


      // ------------ Default: Nothing found ----------

      default:
      if (args[1]) {
        message.author.send("'"+args[1]+"' Unknown set profile function. Please use '"+config.prefix+"help kp' for more infos.");
      }
      else {
        message.author.send("No function given for your set profile command. Please use '"+config.prefix+"help kp' for more infos.");
      }
      return;
      break;
    }

  }

  // =======================================================================================
  // ============ No special command : fallling back to the default search & display profile

  let userSearch    = null;
  let searchId      = null;
  let user          = null;
  let nickName      = null;

  // --- Format the user search request

  if (args.length==0){
    userSearch    = message.author.username;
    searchId      = message.author.id;
  }
  else {
    userSearch    = args.join(" ");
    if (userSearch.startsWith('<@')) {
      searchId = userSearch.slice(2, -1);
      if (searchId.charAt(0) === "!") {
        searchId = searchId.substr(1);
      }
    }
    else {
      if (!isNaN(userSearch) && userSearch.length === 18)
        searchId = userSearch;
      else if (/#(\d{4})\b/.test(userSearch))
        searchId = message.guild
          ? client.users.exists('tag', userSearch)
            ? client.users.find('tag', userSearch).id
            : null
          : null;
      else
        searchId = message.guild
          ? client.users.exists('username', userSearch)
            ? client.users.find('username', userSearch).id
            : null
          : null;
    }
  }

  // --- Try to match a user (Own profile only in Direct message, Everything in Text channels using Mention/User ID/Exact Username/Exact User Tag)

  if (message.channel.type=="dm") {
    // dm channel
    if(args.length >= 1)
      return message.channel.send("Sorry, searching a user is related to a memberlist, it's not possible on direct message. You need to be on a text channel to search for a user.");
  }

  user = client.users.get(searchId);
  if (!user) {
    message.channel.send("Sorry, no profile found for '"+userSearch+"' on this Discord server.\nHave you tried: Mention/User ID/**Exact** Username or User Tag in your query?");
    return;
  }

  // --- Get additionnal user info from database (or store the new profile if not available)

  db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id],
    function(err, rows, fields) {
      if (err) {
        logger.error(err);
        message.channel.send("Error reading profile");
        return;
      }
      if (rows.length) {
        displayprofile(message, user, rows[0]);
      }
      else {
        createNewProfile(user, message);
      }
    }
  );
}

// ==================== Create a new profile ============

function createNewProfile (user, message = null) {

  db.execute('INSERT INTO `users` (`user_discord_id`, `user_username`, `user_discriminator`, `user_description`) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE `user_discord_id` = ?', [user.id, user.username, user.discriminator, defaultDescription, user.id],
    function(err, results, fields) {
      if (err) {
        logger.error(err);
        if (message) {
          message.channel.send("Error creating profile");
        }
        return;
      }
      logger.info("New profile created: "+user.username+" - id: "+user.id);
      if (message) {
        displayprofile(message, user);
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

 function displayprofile(message, user, dbProfileInfos=null) {

  const unionName     = "UnionName PlaceHolder";
  const unionRole     = "coming soon"
  const unionInvite   = "https://discord.gg/QGUhtaK";

  if (dbProfileInfos == null) {
    db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id],
      function(err, rows, fields) {
        if (err) {
          logger.error(err);
          message.channel.send("Error reading profile");
          return;
        }
        if (rows.length) {
          displayprofile(message, user, rows[0]);
          return;
        }
        else {
          message.channel.send("Error no profile found for display.");
          return;
        }
      }
    );
    return;
  }

  let nickName        = null;

  // --- get nickName when using text channels
  if (message.channel.type!="dm") {
    guildUser = message.guild.members.get(user.id);
    if (guildUser) {
      nickName = guildUser.nickname;
    }
  }

  // --- Build user fullname
  let fullUserName = user.username;
  if(nickName){
    fullUserName  = nickName+" / "+user.username;
  }

  const createdDate   = moment(dbProfileInfos['user_created_on']).format("MMMM DD YYYY");

  let updatedDate     = "Never, this is the default profile";
  if (dbProfileInfos['user_updated_on']) {
    updatedDate     = moment(dbProfileInfos['user_updated_on']).format("MMMM DD YYYY HH:mm:ss");
  }

  let countryFlag = ":earth_africa:";
  let localTime   = "Not provided";
  let countrycode = dbProfileInfos['user_country_code'];
  let timezone    = dbProfileInfos['user_timezone'];

  if (moment.tz.zone(timezone)) {
    localTime = moment().tz(timezone).format("dddd, HH:mm");
    countryFlag = ":flag_"+countrycode.toLowerCase()+":";
  }

  let nutakuID = "Not provided";
  if (dbProfileInfos['user_nutaku_id']){
    nutakuID = dbProfileInfos['user_nutaku_id'];
  }

  reputationText = "No kudos yet";
  if (dbProfileInfos['user_rep_point']>0) {
    reputationText = dbProfileInfos['user_rep_point']+" kudos received";
  }

  let userLang = "English";
  if (dbProfileInfos['user_lang']) {
    userLang = dbProfileInfos['user_lang'];
  }

  let waifu = "None";
  if (dbProfileInfos['user_waifu']) {
    waifu = dbProfileInfos['user_waifu'];
  }
  if (dbProfileInfos['user_waifu_link']) {
    waifu = "["+waifu+"]("+dbProfileInfos['user_waifu_link']+")";
  }

  let avatarURL = user.avatarURL;
  if ( avatarURL == null) {
    avatarURL = config.thumbrooturl+"\/images_bot\/default_avatar.png";
  }

  const embed = new discord.RichEmbed()
  embed.setTitle(":regional_indicator_u: "+unionName+" ["+unionRole+"]");
  embed.setAuthor("Name: "+fullUserName, "");
  embed.setColor("#00AE86");
  embed.setDescription("```\n"+dbProfileInfos['user_description']+"```");
  embed.setThumbnail(avatarURL);

  let presence = user.presence.status.charAt(0).toUpperCase() + user.presence.status.slice(1);
  if (user.presence.status=="offline") {
    if (dbProfileInfos['user_last_online']) {
      presence = "Last visit: "+moment(dbProfileInfos['user_last_online']).fromNow();
    }
    else {
      presence = "Offline";
    }
  }

  embed.addField(":arrow_up: Player Level:", "Level "+dbProfileInfos['user_level'], true);
  embed.addField(":id: Game Player ID:", nutakuID, true);
  embed.addField(":speech_left: Spoken Language:", userLang ,true);
  embed.addField(countryFlag+" Country & Local Time:", localTime, true);
  embed.addField(":military_medal: Kudos Points:", reputationText, true);
  embed.addField(":heart: Favorite Character:",waifu, true);
  embed.addField(":timer: Created On:", createdDate, true);
  embed.addField(":hourglass: Online Status:", presence ,true);

  embed.setFooter("Profile updated on: "+updatedDate,"");

  if (unionInvite){
    embed.setURL(unionInvite);
  }

  message.channel.send({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));

}
