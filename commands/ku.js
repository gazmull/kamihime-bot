// Union

const   discord     = require("discord.js");
const   config      = require("../config.json");
const   db          = require("../utils/dbconfig").pool;
const   moment      = require("moment-timezone");
const   momentZones = require('moment-timezone/data/meta/latest.json');

const   logger      = require("../utils/logger").logger;


exports.createUnion     = (guild) => {
  createNewUnion(guild);
}


exports.run     = async (client, message, args) => {

  // ============ process the 'set' command

  if (args[0]=="set") {
    unionSetCommand(client, message, args);
    return;
  }
  if (args[0]=="new") {
    createNewUnion(message.guild, message);
    return;
  }
  if (args[0]=="role") {
    unionRoleCommand(client, message, args);
    return;
  }


  // =======================================================================================
  // ============ No special command : fall back to the default search & display Unions

  let userSearch    = null;
  let searchId      = null;
  let user          = null;

  // --- Format the union search request

  if (args.length==0){
    // no query: get user union
    userSearch    = message.guild.name;
    searchId      = message.guild.ownerID;
  }
  else {
    userSearch    = args.join(" ");
    if (userSearch.startsWith('<@')) {
      // search union related to a username
      searchId = userSearch.slice(2, -1);
      if (searchId.charAt(0) === "!") {
        searchId = searchId.substr(1);
      }
    }
    else {
      // search union by unionname or unionId
    }
  }

  // --- Try to match a user (Own profile only in Direct message, Everything in Text channels using Mention/User ID/Exact Username/Exact User Tag)

  if (message.channel.type=="dm") {
    // dm channel
    if(args.length >= 1)
      return message.channel.send("Sorry, searching union of a user is related to a memberlist, it's not possible on direct message. You need to be on a text channel to search for a user.");
  }

  user = client.users.get(searchId);
  if (!user) {
    message.channel.send("Sorry, no profile found for '"+userSearch+"' on this Discord server.\nHave you tried: Mention/User ID/**Exact** Username or User Tag in your query?");
    return;
  }

  // --- Get additionnal user info from database (or store the new profile if not available)

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id]);
    if (rows.length) {
      try {
        const [urows, ufields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [rows[0]['user_discord_union_id']]);
        if (urows.length) {
          displayUnion(message, urows[0]);
        }
        else {
          message.channel.send("Error no union found for "+userSearch);
        }
      } catch (err) {
        logger.error(err);
        message.channel.send("Error reading union");
      }
    }
    else {
      message.channel.send("No profile found for this user in our database");
    }
  } catch (err) {
    logger.error(err);
    message.channel.send("Error reading profile");
    return;
  }

}


// ==================== Union Set Commands ============

function unionSetCommand(client, message, args) {

  const dateUpdated = moment().format("YYYY-MM-DD HH:mm:ss");

  if (message.channel.type!="dm") {
      message.channel.send("The response had been sent to you by direct message.");

      let spamMessage    = "```css\nTo limit spam in text channels, updating union commands will be redirected to direct messages.\n";
      spamMessage       += "[Please type your next update commands here.]\n";
      spamMessage       += "[Do not use text channels for updating your union profile.]\n";
      spamMessage       += "If you need help, type '"+config.prefix+"help ku'.```";
      spamMessage       += "```\nYour last command was '"+message.content+"' and my response is:```";

      message.author.send(spamMessage);
  }

  switch (args[1]) {

    // ------------ Name ----------

    case "name":
    return;
    break;

    // ------------ Nbmembers ----------

    case "nbmembers":
    return;
    break;

    // ------------ Desc ----------

    case "desc":
    return;
    break;

    // ------------ Default: Nothing found ----------

    default:
    if (args[1]) {
      message.author.send("'"+args[1]+"' Unknown set union function. Please use '"+config.prefix+"help ku' for more infos.");
    }
    else {
      message.author.send("No function given for your set union command. Please use '"+config.prefix+"help ku' for more infos.");
    }
    return;
    break;
  }

}

// ==================== Union Role Commands ============

function unionRoleCommand(client, message, args) {

  const dateUpdated = moment().format("YYYY-MM-DD HH:mm:ss");

  if (message.channel.type!="dm") {
      message.channel.send("The response had been sent to you by direct message.");

      let spamMessage    = "```css\nTo limit spam in text channels, updating union commands will be redirected to direct messages.\n";
      spamMessage       += "[Please type your next update commands here.]\n";
      spamMessage       += "[Do not use text channels for updating your union profile.]\n";
      spamMessage       += "If you need help, type '"+config.prefix+"help ku'.```";
      spamMessage       += "```\nYour last command was '"+message.content+"' and my response is:```";

      message.author.send(spamMessage);
  }

  switch (args[1]) {

    // ------------ Name ----------

    case "subleader":
    return;
    break;

    // ------------ Nbmembers ----------

    case "officer":
    return;
    break;

    // ------------ Desc ----------

    case "member":
    return;
    break;

    // ------------ Default: Nothing found ----------

    default:
    if (args[1]) {
      message.author.send("'"+args[1]+"' Unknown role union function. Please use '"+config.prefix+"help ku' for more infos.");
    }
    else {
      message.author.send("No function given for your role union command. Please use '"+config.prefix+"help ku' for more infos.");
    }
    return;
    break;
  }

}

// ==================== Display a Formatted Union ============

 function displayUnion(message, union) {

  if (!union) {
    message.channel.send("No union found, or no union for this user.");
    return;
  }

  message.channel.send("UnionId: "+union['union_discord_guild_id']+"\nUnionName: "+union['union_name']+ "\nUnion OwnerId: "+union['union_discord_owner_id'] );

}


// ==================== Create a new Union ============

async function createNewUnion (guild, message = null) {

  const dateCreated = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guild.id]);
    if (rows.length) {
      if (message) {
        message.channel.send("Union Already registered");
      }
    }
    else {
      try {
        const [results, fields] = await db.execute('INSERT INTO `unions` (`union_discord_guild_id`, `union_discord_guild_name`, `union_discord_owner_id`, `union_name`, `union_created_on`,`union_active`) VALUES(?,?,?,?,?,1) ON DUPLICATE KEY UPDATE `union_discord_guild_id` = ?', [guild.id, guild.name, guild.ownerID, guild.name, dateCreated, guild.id]);
        logger.info("New union created: "+guild.name+" - id: "+guild.id);

        try {
          const [results, fields] = await db.execute('UPDATE `users` SET `user_discord_union_id`=? WHERE `user_discord_id`=?', [guild.id, guild.ownerID]);
          logger.info("union owner updated: "+guild.name+" - userId: "+guild.ownerID);
        } catch (err) {
          logger.error(err);
          if (message) {
            message.channel.send("Enable to update OwnerId for this union.");
            return;
          }
        }

        if (message) {
          try {
            const [rows, fields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guild.id]);
            if (rows.length) {
              displayUnion(message, rows[0]);
            }
            else {
              message.channel.send("Error no union found.");
            }
          } catch (err) {
            logger.error(err);
            message.channel.send("Error reading union");
          }
        }
      } catch (err) {
        logger.error(err);
        if (message) {
          message.channel.send("Error creating Union");
        }
      }
    }
  } catch (err) {
    logger.error(err);
    message.channel.send("Error reading union");
    return;
  }

}
