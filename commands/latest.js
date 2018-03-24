const Command = require('../struct/Command');

class LatestCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'latest',
      description: {
        content: [
          'Displays up to 15 (default) latest updates in the bot\'s database downloaded from Kamihime Project Wikia (Nutaku).',
          'This also displays the total number of objects registered in the bot\'s database.'
        ],
        usage: '[optional # of objects to list]',
        examples: ['13', '5']
      },
      permissions: ['SEND_MESSAGES']
    });
  }

  run(message, [count = 15]) {
    const {
      client: {
        khDB: {
          all,
          kamihime,
          eidolon,
          soul,
          weapon,
          accessory
        }
      }
    } = this;
    const objects = [];

    for (let i = 0; i < count; ++i) {
      const current = all()[i];

      objects.push(`${current.timestamp} [${current.name}](${current.objectType})`);
    }

    return message.channel.send([
      '```Markdown\n',
      objects.join('\n'),
      '```',
      '```Markdown\n',
      `Totals: [Kamihime](${kamihime().length}) `,
      `[Eidolon](${eidolon().length}) `,
      `[Soul](${soul().length}) `,
      `[Weapon](${weapon().length}) `,
      `[Accessory](${accessory().length})`,
      '```'
    ].join(''));
  }
}

module.exports = LatestCommand;
