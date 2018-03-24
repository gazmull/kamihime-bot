const moment = require('moment-timezone');
const Event = require('../struct/Event');

class PresenceUpdateEvent extends Event {
  constructor(client) {
    super(client, { name: 'presenceUpdate' });
  }

  async run(oldMember, newMember) {
    const { client: { commands, db } } = this;
    const oldStatus = oldMember.presence.status;
    const newStatus = newMember.presence.status;

    if (oldStatus !== newStatus && ['online', 'offline'].includes(newStatus))
      try {
        const [rows] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [newMember.id]);

        if (rows.length) {
          const dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss');
          await db.execute('UPDATE `users` SET `user_last_online` = ? WHERE `user_discord_id` = ?', [dateUpdated, newMember.id]);
        } else commands.get('kp').createProfile(newMember.user);
      } catch (err) {
        this.handleError(err);
      }
  }
}

module.exports = PresenceUpdateEvent;
