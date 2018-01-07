// this event triggers when a user status is updated.

const   config      = require("../config.json");
const   db          = require("../dbconfig.js").pool;
const   moment      = require("moment-timezone");
const   logger      = require("../logger.js").logger;

exports.run = (client, oldMember, newMember) => {

  if(oldMember.presence.status !== newMember.presence.status) {

    if ( (newMember.presence.status == "online") || (newMember.presence.status == "offline") ) {

      logger.info(`${newMember.user.username} is now ${newMember.presence.status}`);
      const dateUpdated = moment().format("YYYY-MM-DD HH:mm:ss");
      db.execute('UPDATE `users` SET `user_last_online`=? WHERE `user_discord_id`=?', [dateUpdated, newMember.user.id],
        function(err, results, fields) {
          if (err) {
            console.log(err);
            return;
          }
        }
      );
    }
  }
}
