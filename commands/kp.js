const Command = require('../struct/Command');
// const moment = require('moment-timezone');
// const momentZones = require('moment-timezone/data/meta/latest.json');
// const fuzzy = require('fuzzy');

class UserProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kp',
      description: {
        content: '',
        usage: '',
        examples: []
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }
}

module.exports = UserProfileCommand;
