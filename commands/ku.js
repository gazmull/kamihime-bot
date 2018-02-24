// Union

const discord = require("discord.js");
const config = require("../config.json");
const db = require("../utils/dbconfig").pool;
const moment = require("moment-timezone");
const momentZones = require('moment-timezone/data/meta/latest.json');
const kp = require("../commands/kp");

const logger = require("../utils/logger").logger;


exports.createUnion = (guild) => {
  createNewUnion(guild);
}

exports.run = async (client, message, args) => {

  // For testing: Restricted to drumicube
  if(message.author.id != 361433266869501953) {
    //message.author.send("Restricted");
    return;
  }

  // ============ process the 'set' command

  if(args[0] == "set") {
    unionSetCommand(client, message, args);
    return;
  }
  if(args[0] == "register") {
    unionRegisterCommand(client, message, args);
    return;
  }
  if(args[0] == "list") {
    unionListCommand(client, message, args);
    return;
  }


  // =======================================================================================
  // ============ No special command : fall back to the default search & display Unions

  let userSearch = null;
  let searchId = null;
  let user = null;

  // --- Format the union search request

  if(args.length == 0) {
    // no query: get user union
    if(message.channel.type == "dm") {
      return message.channel.send("Sorry, wip in dm");
    }
    userSearch = message.guild.name;
    searchId = message.guild.ownerID;
  } else {
    userSearch = args.join(" ");

    // search union related to a username
    if(userSearch.startsWith('<@')) {
      searchId = userSearch.slice(2, -1);
      if(searchId.charAt(0) === "!") {
        searchId = searchId.substr(1);
      }
    }

    // search by union id
    const unionId = parseInt(userSearch);
    if(unionId) {
      try {
        const [urows, ufields] = await db.execute('SELECT * FROM `unions` WHERE `union_id` = ?', [unionId]);
        if(urows.length) {
          displayUnion(client, message, urows[0]);
        } else {
          message.channel.send("Error no union found for #Id " + unionId);
        }
      } catch(err) {
        logger.error(err);
        message.channel.send("Error reading union");
      }
      return;
    }
  }

  // --- Try to match a user (Own profile only in Direct message, Other profile in Text channels only)

  if(message.channel.type == "dm") {
    // dm channel
    if(args.length >= 1)
      return message.channel.send("Sorry, searching union of a user is related to a memberlist, it's not possible on direct message. You need to be on a text channel to search for a user.");
  }

  user = client.users.get(searchId);
  if(!user) {
    message.channel.send("Sorry, no profile found for '" + userSearch + "' on this Discord server.\n");
    return;
  }

  // --- Get union based on the user profile

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id]);
    if(rows.length) {
      try {
        const [urows, ufields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [rows[0]['user_discord_union_id']]);
        if(urows.length) {
          displayUnion(client, message, urows[0]);
        } else {
          message.channel.send("Error no union found for " + userSearch);
        }
      } catch(err) {
        logger.error(err);
        message.channel.send("Error reading union");
      }
    } else {
      message.channel.send("No profile found for this user in our database");
    }
  } catch(err) {
    logger.error(err);
    message.channel.send("Error reading profile");
    return;
  }

}


// ==================== Union Set Commands ============

async function unionSetCommand(client, message, args) {

  const dateUpdated = moment().format("YYYY-MM-DD HH:mm:ss");

  if(message.channel.type != "dm") {
    message.channel.send("The response had been sent to you by direct message.");

    let spamMessage = "```css\nTo limit spam in text channels, updating union commands will be redirected to direct messages.\n";
    spamMessage += "[Please type your next update commands here.]\n";
    spamMessage += "[Do not use text channels for updating your union profile.]\n";
    spamMessage += "If you need help, type '" + config.prefix + "help ku'.```";
    spamMessage += "```\nYour last command was '" + message.content + "' and my response is:```";

    message.author.send(spamMessage);
  }

  switch(args[1]) {

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
      if(args[1]) {
        message.author.send("'" + args[1] + "' Unknown set union function. Please use '" + config.prefix + "help ku' for more infos.");
      } else {
        message.author.send("No function given for your set union command. Please use '" + config.prefix + "help ku' for more infos.");
      }
      return;
      break;
  }

}


// ==================== Union Register Commands ============

async function unionRegisterCommand(client, message, args) {

  switch(args[1]) {

    // ------------ Register all server ----------

    case "all":
      if(message.author.id != 361433266869501953) {
        return message.channel.send("Sorry, for now the 'register all' command is restricted to userId 361433266869501953 only.");
      }
      const guildList = await client.guilds.array();
      try {
        for(const guild of guildList) {
          if(await createNewUnion(guild, message)) {
            //message.channel.send("New union created or updated: " + guild.name + " - id: " + guild.id);
          }
        }
      } catch(err) {
        console.log("Could not create union " + guild.name);
      }
      return;
      break;

      // ------------ Default: Register the current Discord server only ----------

    default:
      if(message.channel.type == "dm") {
        return message.channel.send("Sorry, Register commands are related to a Discord server, it's not possible on direct message. You need to be on a text channel to use them.");
      }
      if(args[1]) {
        return message.channel.send("'" + args[1] + "' Unknown register union function. Please use '" + config.prefix + "help ku' for more infos.");
      } else {
        if(await createNewUnion(message.guild, message)) {
          const union = await getUnionById(message.guild.id);
          if(union) {
            //message.channel.send("New union created or updated: " + guild.name + " - id: " + guild.id);
            displayUnion(client, message, union);
          } else {
            message.channel.send("Error no union found.");
          }
        }
      }
      return;
      break;
  }

}


// ==================== Union List Commands ============

async function unionListCommand(client, message, args) {

  let page = 0;

  if(args[1]) {
    const wantedPage = parseInt(args[1]);
    if(wantedPage > 0) {
      page = wantedPage - 1;
    }
  }

  const nbByPage = 20;
  const startpage = page * nbByPage;
  const endpage = startpage + nbByPage;

  let output = "";
  let unionCount = 0;

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `unions` INNER JOIN `users` WHERE unions.union_discord_owner_id=users.user_discord_id AND `union_active`=1 ORDER BY unions.union_recruitment DESC, unions.union_id LIMIT ?,?', [startpage, nbByPage]);
    if(rows.length) {

      try {
        const [count, fields] = await db.execute('SELECT COUNT (*) FROM `unions` WHERE `union_active`=1', []);
        unionCount = count[0]['COUNT (*)'];
      } catch(err) {
        logger.error(err);
      }

      for(let i = 0; i < rows.length; i++) {
        if(rows[i]['union_recruitment']) {
          output += "✔️ ";
        } else {
          output += "❌ ";
        }
        output += "[Id #" + rows[i]['union_id'] + "](" + rows[i]['union_name'] + ") - [" + rows[i]['union_discord_nb_member'] + " members](Leader: " + rows[i]['user_username'] + "#" + rows[i]['user_discriminator'] + ")\n";
      }
      if(output) {
        output = "```Markdown\n" + output + "```";
        message.channel.send(output);
      }
      const nbUnion = unionCount;
      const totalPage = Math.ceil(nbUnion / nbByPage);

      let listHelp = "```Markdown\n[Page " + (page + 1) + "/" + totalPage + "](" + config.prefix + "ku list [pageNumber] to display a specific page)\n";
      listHelp += "[✔️/❌](Recruitment is open/close)\n";
      listHelp += config.prefix + "ku [IdNumber] => Display more details about an union.\n";
      listHelp += "```";

      message.channel.send(listHelp);

    }
  } catch(err) {
    logger.error(err);
  }
}

// ==================== Create a new Union ============

async function createNewUnion(guild, message = null) {

  const dateCreated = moment().format("YYYY-MM-DD HH:mm:ss");

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guild.id]);
    if(!rows.length)
    {
      try {
        const [results, fields] = await db.execute('INSERT INTO `unions` (`union_discord_guild_id`, `union_discord_guild_name`, `union_discord_owner_id`, `union_name`, `union_created_on`,`union_active`) VALUES(?,?,?,?,?,1) ON DUPLICATE KEY UPDATE `union_discord_guild_id` = ?', [guild.id, guild.name, guild.ownerID, guild.name, dateCreated, guild.id]);
        if(message) {
          message.channel.send("New union created: " + guild.name + " - id: " + guild.id);
        }
        logger.info("New union created: " + guild.name + " - id: " + guild.id);
      } catch(err) {
        logger.error(err);
        if(message) {
          message.channel.send("Error creating Union");
          return false;
        }
      }
    }
  } catch(err) {
    logger.error(err);
    message.channel.send("Error reading union");
    return false;
  }


  // Add the guild owner to the user database if he was missing

  try {
    const [rows, fields] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [guild.ownerID]);
    if(!rows.length) {
      kp.createProfile(guild.owner.user);
    }
  } catch(err) {
    logger.error(err);
    return false;
  }

  // Update owner with Leader status

  try {
    const [results, fields] = await db.execute('UPDATE `users` SET `user_discord_union_id`=?, `user_nutaku_role`=? WHERE `user_discord_id`=?', [guild.id, 'Leader', guild.ownerID]);
    logger.info("Union owner updated: " + guild.name + " - userId: " + guild.ownerID);
    if(message) {
      message.channel.send("Union owner updated: " + guild.name + " - user: " + guild.owner.user.username+"#"+guild.owner.user.discriminator);
    }
  } catch(err) {
    logger.error(err);
    if(message) {
      message.channel.send("Enable to update OwnerId for this union.");
      return false;
    }
  }

  // Update memberCount for this union

  try {
    const [results, fields] = await db.execute('UPDATE `unions` SET `union_discord_nb_member`=? WHERE `union_discord_guild_id`=?', [guild.memberCount,guild.id]);
    if(message) {
      message.channel.send("Union member count updated: " + guild.name + " - memberCount: " + guild.memberCount);
    }
    logger.info("Union memberCount updated: " + guild.name + " - memberCount: " + guild.memberCount);
  } catch(err) {
    logger.error(err);
    if(message) {
      message.channel.send("Enable to update member count for this union.");
      return false;
    }
  }

  return true;
}

// ==================== Get Union by Id ============

async function getUnionById(guildId) {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guildId]);
    if(rows.length) {
      return rows[0];
    } else {
      return null;
    }
  } catch(err) {
    logger.error(err);
  }
}

// ==================== Display a Formatted Union ============

async function displayUnion(client, message, union) {

  if(!union) {
    message.channel.send("No union found, or no union for this user.");
    return;
  }

  let avatarURL = null;
  if(avatarURL == null) {
    avatarURL = config.thumbrooturl + "\/images_bot\/default_avatar.png";
  }

  let ownerTag = "";
  const owner = client.users.get(union['union_discord_owner_id']);
  if(owner) {
    ownerTag = owner.tag;
  } else {
    try {
      const [rows, fields] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [union['union_discord_owner_id']]);
      if(rows.length) {
        ownerTag = rows[0]['user_username'] + "#" + rows[0]['user_discriminator'];
      }
    } catch(err) {
      logger.error(err);
    }
  }

  const embed = new discord.RichEmbed()
  embed.setAuthor(union['union_name'] + " (Id #" + union['union_id'] + ")");
  embed.setTitle(":crown: " + ownerTag, "");
  embed.setColor("#00AE86");
  embed.setThumbnail(avatarURL);
  embed.setDescription("```\nUnion description text```");
  message.channel.send({ embed }).then(sentMessage => message.client.clearDialog(message, sentMessage));

}
