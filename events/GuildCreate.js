const Event = require('../struct/Event');

class GuildCreateEvent extends Event {
  constructor(client) {
    super(client, { name: 'guildCreate' });
  }

  async run(guild) {
    const { name, id, memberCount, ownerID, owner: { user } } = guild;
    const { client, client: { db, commands }, prefix } = this;

    this.logger('info', `Guild Update: I joined ${name} (${id}). memberCount: ${memberCount}`);
    await client.user.setActivity(`say ${prefix}help | ${client.guilds.size} servers`, { type: 'WATCHING' });

    try {
      const [uRows] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [ownerID]);

      if (!uRows.length)
        commands.get('kp').createProfile(user);

      const [gRows] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [id]);

      if (gRows.length)
        await db.execute('UPDATE `unions` SET `union_active` = 1 WHERE `union_discord_guild_id` = ?', [id]);
      else
        commands.get('ku').createUnion(guild);
    } catch (err) {
      this.handleError(err);
    }
  }
}

module.exports = GuildCreateEvent;
