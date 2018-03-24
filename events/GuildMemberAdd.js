const Event = require('../struct/Event');

class GuildMemberAddEvent extends Event {
  constructor(client) {
    super(client, { name: 'guildMemberAdd' });
  }

  async run(member) {
    const { client: { commands, db } } = this;
    const guild = member.guild;

    this.logger('info', `Guild Update: ${member.user.username} (${member.id}) joined ${guild.name}`);

    try {
      const [rows] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [member.user.id]);

      if (!rows.length)
        commands.get('kp').createProfile(member.user);

      await db.execute('UPDATE `unions` SET `union_discord_nb_member` = ? WHERE `union_discord_guild__id` = ?', [guild.memberCount, guild.id]);
      this.logger('info', `Guild Update: ${guild.name} - memberCount: ${guild.memberCount}`);
    } catch (err) {
      this.handleError(err);
    }
  }
}

module.exports = GuildMemberAddEvent;
