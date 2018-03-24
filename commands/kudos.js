const Command = require('../struct/Command');
const moment = require('moment-timezone');

class KudosCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kudos',
      description: {
        content: [
          'Sends one kudos to a user. (Text Channels only)',
          'Only one kudos points can be sent every 24 hours.'
        ],
        usage: '[mention username]',
        examples: ['@User#0001']
      },
      permissions: ['SEND_MESSAGES']
    });
  }

  get now() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  async run(message) {
    if (message.channel.type !== 'text')
      return message.reply('this command is not available in DMs. You need to be on a text channel (in a server)');

    const mentions = message.mentions;

    if (!mentions.users.size)
      return message.reply('please provide a username using via mention.');

    const user = mentions.users.first();
    const author = message.author;

    if (author.id === user.id)
      return message.reply('sending kudos to yourself is not allowed.');

    const { client: { db } } = this;

    try {
      // -- Check for recently given kudos points by author
      const [aRows] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [author.id]);

      if (!aRows.length)
        return message.reply('I cannot read your profile.');

      const lastGiven = moment(aRows[0].user_last_given_rep);
      const dateDelta = moment.duration(moment().diff(lastGiven));
      const minutesDelta = dateDelta.asMinutes();

      if (minutesDelta < (24 * 60))
        return message.reply([
          'Sending kudos point is allowed once a day.',
          `You already have sent one on ${lastGiven.format('YYYY-MM-DD HH:mm:ss')}`
        ].join('\n'));

      // -- Load user profile, then give kudos points to user
      const [uRows] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id]);

      if (!uRows.length)
        return message.reply(`there is no profile found for ${user.tag} in our database.`);

      const kudos = uRows[0].user_rep_point + 1;

      await db.execute('UPDATE `users` SET `user_rep_point` = ? WHERE `user_discord_id` = ?;', [kudos, user.id]);
      await db.execute('UPDATE `users` SET `user_last_given_rep` = ? WHERE `user_discord_id` = ?', [this.now, author.id]);

      return message.reply(`one kudos point sent to ${user}!`);
    } catch (err) {
      this.handleError(err);
    }
  }
}

module.exports = KudosCommand;
