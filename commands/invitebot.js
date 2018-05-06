const Command = require('../struct/Command');

class InviteBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invitebot',
      aliases: ['invite'],
      description: {
        content: [
          'Provides a link to install this bot to your Discord server.',
          'Please ensure that you have the \'Manage Server\' permission in your Discord server to allow installation.'
        ]
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });

    this.bitfield = 3072;
  }

  run(message) {
    const {
      client: {
        user: {
          displayAvatarURL,
          username,
          id
        }
      },
      util,
      bitfield
    } = this;

    const embed = util.embed()
      .setColor(0x00AE86)
      .setAuthor(`${username} Bot`)
      .setThumbnail(displayAvatarURL)
      .setURL(
        [
          `https://discord.gg/oauth2/authorize?client_id=${id}`,
          'scope=bot',
          `permissions=${bitfield}`
        ].join('&')
      )
      .setTitle('Click here to add this bot to your own server')
      .setDescription(
        [
          'Please ensure that you have the \'Manage Server\' permission',
          'in your Discord server to allow installation.'
        ].join(' ')
      );

    return message.channel.send(embed);
  }
}

module.exports = InviteBotCommand;
