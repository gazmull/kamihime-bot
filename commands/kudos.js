// Search & Display user profile, or Update your own Profile

const   discord     = require("discord.js");
const   config      = require("../config.json");
const   db          = require("../dbconfig.js").pool;
const   moment      = require("moment-timezone");
const   logger      = require("../logger.js").logger;

exports.run     = (client, message, args) => {

  let userSearch    = null;
  let searchId      = null;
  let user          = null;

  // --- Format the user search request

  if (args.length==0){
    message.channel.send("Please provide a username using the @username argument.");
    return;
  }
  else {
    userSearch    = args.join(" ");
    searchId = userSearch.slice(2, -1);
    if( searchId.charAt(0) === "!") {
      searchId = searchId.substr(1);
    }
  }

  // --- Try to match a user

  if (message.channel.type=="dm") {
    // dm channel
    message.channel.send("Sorry, sending kudos is not possible on direct message. You need to be on a text channel to do that.");
    return;
  }

  user = client.users.get(searchId);
  if (!user) {
    message.channel.send("Sorry, no profile found for '"+userSearch+"' on this Discord server.\nDon't forget to add @ before the username.");
    return;
  }

  if (message.author.id == user.id) {
    message.channel.send("Sending kudos to yourself is not allowed...");
    return;
  }


  // --- Get user info from database

  const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");

  db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [message.author.id],
    function(err, rows, fields) {
      if (err) {
        logger.error(err);
        message.channel.send("Error reading your profile");
        return;
      }

      if (rows.length) {

        // Check last kudos data from the sender (24 hours limit)
        if(rows[0]['user_last_given_rep']) {
          const lastKudosDate = moment(rows[0]['user_last_given_rep']);
          const deltaDate = moment.duration(moment().diff(lastKudosDate));
          const minutesDelta = deltaDate.asMinutes();
          if (minutesDelta<(24*60)) {
            message.channel.send("Sending kudos is allowed once every day. You already sent one on "+moment(rows[0]['user_last_given_rep']).format("YYYY-MM-DD HH:mm:ss"));
            return;
          }
        }
      }
      else {
        message.channel.send("Error reading your profile");
        return;
      }

      // Load the targetted user

      db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id],
        function(err, rows, fields) {
          if (err) {
            logger.error(err);
            message.channel.send("Error reading user profile");
            return;
          }
          if (rows.length) {
            // Add one kudos to the targetted user
            let kudos = rows[0]['user_rep_point'];
            kudos++;
            db.execute('UPDATE `users` SET `user_rep_point`=? WHERE `user_discord_id`=?', [kudos, user.id],
              function(err, results, fields) {
                if (err) {
                  logger.error(err);
                  message.channel.send("Error updating user kudos");
                  return;
                }
                // Update Last kudos date for the sender
                db.execute('UPDATE `users` SET `user_last_given_rep`=? WHERE `user_discord_id`=?', [dateNow, message.author.id],
                  function(err, results, fields) {
                    if (err) {
                      logger.error(err);
                      message.channel.send("Error updating kudos");
                      return;
                    }
                    message.channel.send("One kudos sent to "+userSearch);
                  }
                );
              }
            );
            return;
          }
          else {
            message.channel.send("Sorry, no profile found for '"+userSearch+"' on our database.");
          }
        }
      );
    }
  );

}
