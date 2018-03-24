const Event = require('../struct/Event');

class GuildDeleteEvent extends Event {
  constructor(client) {
    super(client, { name: 'guildDelete' });
  }

  async run(guild) {
    const { name, id } = guild;
    const { client, client: { db }, prefix } = this;

    try {
      await client.user.setActivity(`say ${prefix}help | ${client.guilds.size} servers`, { type: 'WATCHING' });
      await db.execute('UPDATE `unions` SET `union_active` = 0 WHERE `union_discord_guild_id` = ?', [id]);

      this.logger('info', `Guild Update: I left ${name} (${id})`);
    } catch (err) {
      this.handleError(err);
    }
  }
}

module.exports = GuildDeleteEvent;
