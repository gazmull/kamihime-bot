const Command = require('../struct/Command');

class CountdownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'countdown',
      description: {
        content: [
          'Displays countdowns related to Kamihime Project in-game events.',
          'It includes special and some regular events.',
          'Date Format: [YYY]-[MM]-[DD]T[HH]:[mm]'
        ],
        examples: ['add 2018-04-23T00:00'],
        usage: '[command] [command argument]'
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });

    this.preset = [
      { name: 'Daily Reset', time: '0:00', dayofweek: '*' },
      { name: 'Weapon/Eidolon Enhancement Quest1', time: '12:00', dayofweek: '*' },
      { name: 'Weapon/Eidolon Enhancement Quest2', time: '19:00', dayofweek: '*' },
      { name: 'Weapon/Eidolon Enhancement Quest3', time: '22:00', dayofweek: '*' }
    ];
    this.units = null;
  }

  authorized(user) {
    const users = this.client.config.countdown_authorized_users;

    return users.includes(user.id);
  }
}

module.exports = CountdownCommand;
