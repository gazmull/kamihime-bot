// This event triggers when a member joins a guild.

const   config      = require("../config.json");
const   db          = require("../dbconfig.js").pool;
const   moment      = require("moment-timezone");
const   kp          = require("../commands/kp.js");

exports.run = (client, member) => {
  let guild = member.guild;
  console.log(`New member joined: ${member.user}} `);

  const dateUpdated = moment().format("YYYY-MM-DD HH:mm:ss");

  db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [member.user.id],
    function(err, rows, fields) {
      if (err) {
        console.log(err);
        return;
      }
      if (!rows.length) {
        kp.createProfile(member.user);
      }
    }
  );

}
