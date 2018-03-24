const Command = require('../struct/Command');
// const moment = require('moment-timezone');
// const momentZones = require('moment-timezone/data/meta/latest.json');

class UnionProfileCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ku',
      description: {
        content: '',
        usage: '',
        examples: ''
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }
}

module.exports = UnionProfileCommand;
