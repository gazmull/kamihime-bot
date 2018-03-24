const Event = require('../struct/Event');

class GuildMemberRemoveEvent extends Event {
  constructor(client) {
    super(client, { name: 'guildMemberRemove' });
  }

  async run(member) {
    const { client: { db } } = this;
    const guild = member.guild;

    this.logger('info', `Guild Update: ${member.user.username} (${member.id}) left ${guild.name}`);

    try {
      await db.execute('UPDATE `unions` SET `union_discord_nb_member` = ? WHERE `union_discord_guild_id` = ?', [guild.memberCount, guild.id]);
      this.logger('info', `Guild Update: ${guild.name} - memberCount: ${guild.memberCount}`);
    } catch (err) {
      this.handleError(err);
    }
  }
}

module.exports = GuildMemberRemoveEvent;
