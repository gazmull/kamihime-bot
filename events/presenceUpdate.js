// this event triggers when a user status is updated.

const   config      = require("../config.json");
const   db          = require("../utils/dbconfig").pool;
const   moment      = require("moment-timezone");
const   logger      = require("../utils/logger").logger;
const   kp          = require("../commands/kp");

exports.run = async (client, oldMember, newMember) => {

  if(oldMember.presence.status !== newMember.presence.status) {

    if ( (newMember.presence.status == "online") || (newMember.presence.status == "offline") ) {

      //logger.info(`${newMember.user.username} is now ${newMember.presence.status}`);

      try {
        const [rows, fields] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [newMember.user.id]);
        if (rows.length) {
          const dateUpdated = moment().format("YYYY-MM-DD HH:mm:ss");
          try {
            const [results, fields] = await db.execute('UPDATE `users` SET `user_last_online`=? WHERE `user_discord_id`=?', [dateUpdated, newMember.user.id]);
          } catch (err) {
            logger.error(err);
            return;
          }
        }
        else {
          kp.createProfile(newMember.user);
        }
      } catch (err) {
        logger.error(err);
      }
      
    }
  }
}
