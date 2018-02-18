// Union

const   discord     = require("discord.js");
const   config      = require("../config.json");
const   db          = require("../utils/dbconfig").pool;
const   moment      = require("moment-timezone");
const   momentZones = require('moment-timezone/data/meta/latest.json');
const   kp          = require("../commands/kp");

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
  if (args[0]=="register") {
    unionRegisterCommand(client, message, args);
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

    // search union related to a username
    if (userSearch.startsWith('<@')) {
      searchId = userSearch.slice(2, -1);
      if (searchId.charAt(0) === "!") {
        searchId = searchId.substr(1);
      }
    }

    // search by union id
    const unionId = parseInt(userSearch);
    if (unionId) {
      try {
        const [urows, ufields] = await db.execute('SELECT * FROM `unions` WHERE `union_id` = ?', [unionId]);
        if (urows.length) {
          displayUnion(client, message, urows[0]);
        }
        else {
          message.channel.send("Error no union found for #Id "+unionId);
        }
      } catch (err) {
        logger.error(err);
        message.channel.send("Error reading union");
      }
      return;
    }
  }

  // --- Try to match a user (Own profile only in Direct message, Other profile in Text channels only)

  if (message.channel.type=="dm") {
    // dm channel
    if(args.length >= 1)
      return message.channel.send("Sorry, searching union of a user is related to a memberlist, it's not possible on direct message. You need to be on a text channel to search for a user.");
  }

  user = client.users.get(searchId);
  if (!user) {
    message.channel.send("Sorry, no profile found for '"+userSearch+"' on this Discord server.\n");
    return;
  }

  // --- Get union based on the user profile

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id]);
    if (rows.length) {
      try {
        const [urows, ufields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [rows[0]['user_discord_union_id']]);
        if (urows.length) {
          displayUnion(client, message, urows[0]);
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

async function unionSetCommand(client, message, args) {

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


// ==================== Union Register Commands ============

async function unionRegisterCommand(client, message, args) {

  if (message.channel.type=="dm") {
      return message.channel.send("Sorry, Register commands are related to a Discord server, it's not possible on direct message. You need to be on a text channel to use them.");
  }
  if (message.author.id!=361433266869501953) {
      return message.channel.send("Sorry, for now register commands are restricted to userId 361433266869501953 only.");
  }

  switch (args[1]) {

    // ------------ Register all server ----------

    case "all":
    const guildList = await client.guilds.array();
    try {
      for (const guild of guildList) {
        if (await createNewUnion(guild, message)){
          message.channel.send("New union created: "+guild.name+" - id: "+guild.id);
        }
      }
    } catch (err) {
      console.log("Could not create union " + guild.name);
    }
    return;
    break;

    // ------------ Default: Register the current Discord server only ----------

    default:
    if (args[1]) {
      return message.channel.send("'"+args[1]+"' Unknown register union function. Please use '"+config.prefix+"help ku' for more infos.");
    }
    else {
      if (await createNewUnion(message.guild, message)) {
        const union = await getUnionById(message.guild.id);
        if (union) {
          displayUnion(client, message, union);
        }
        else {
          message.channel.send("Error no union found.");
        }
      }
    }
    return;
    break;
  }

}


// ==================== Union Role Commands ============

async function unionRoleCommand(client, message, args) {

  return message.channel.send("Sorry, Role commands are not available yet.(wip)");

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

// ==================== Create a new Union ============

async function createNewUnion (guild, message = null) {

  const dateCreated = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guild.id]);
    if (rows.length) {
      if (message) {
        message.channel.send("Union Already registered: "+guild.name);
      }
      return false;
    }
    else {
      try {
        const [results, fields] = await db.execute('INSERT INTO `unions` (`union_discord_guild_id`, `union_discord_guild_name`, `union_discord_owner_id`, `union_name`, `union_created_on`,`union_active`) VALUES(?,?,?,?,?,1) ON DUPLICATE KEY UPDATE `union_discord_guild_id` = ?', [guild.id, guild.name, guild.ownerID, guild.name, dateCreated, guild.id]);
        logger.info("New union created: "+guild.name+" - id: "+guild.id);

        // Add the guild owner to the user database if he was missing

        try {
          const [rows, fields] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [guild.ownerID]);
          if (!rows.length) {
            kp.createProfile(guild.owner.user);
          }
        } catch (err) {
          logger.error(err);
        }

        // Update owner with Leader status

        try {
          const [results, fields] = await db.execute('UPDATE `users` SET `user_discord_union_id`=?, `user_nutaku_role`=? WHERE `user_discord_id`=?', [guild.id, 'Leader', guild.ownerID]);
          logger.info("union owner updated: "+guild.name+" - userId: "+guild.ownerID);
        } catch (err) {
          logger.error(err);
          if (message) {
            message.channel.send("Enable to update OwnerId for this union.");
            return false;
          }
        }
        return true;

      } catch (err) {
        logger.error(err);
        if (message) {
          message.channel.send("Error creating Union");
          return false;
        }
      }
    }
  } catch (err) {
    logger.error(err);
    message.channel.send("Error reading union");
    return false;
  }

}

// ==================== Get Union by Id ============

async function getUnionById (guildId) {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guildId]);
    if (rows.length) {
      return rows[0];
    }
    else {
      return null;
    }
  } catch (err) {
    logger.error(err);
  }
}

// ==================== Display a Formatted Union ============

 function displayUnion(client, message, union) {

  if (!union) {
    message.channel.send("No union found, or no union for this user.");
    return;
  }

  let avatarURL = null;
  if ( avatarURL == null) {
    avatarURL = config.thumbrooturl+"\/images_bot\/default_avatar.png";
  }

  const embed = new discord.RichEmbed()
  embed.setAuthor(union['union_name']+ " (Id #"+union['union_id']+")");
  embed.setTitle(":crown: "+client.users.get(union['union_discord_owner_id']).tag, "");
  embed.setColor("#00AE86");
  embed.setThumbnail(avatarURL);
  embed.setDescription("```\nUnion description text```");
  message.channel.send({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));

}
