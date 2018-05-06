const Event = require('../struct/Event');

class MessageEvent extends Event {
  constructor(client) {
    super(client, { name: 'message' });
  }

  async run(message) {
    if (message.author.bot) return;

    const {
      client,
      client: {
        persist,
        config: {
          owners,
          discord_code,
          quiz
        }
      },
      prefix
    } = this;

    const bakas = await persist.get('bakas');

    if (bakas.includes(message.author.id))
      try {
        const kbaka = client.commands.get('kbaka');
        kbaka.insult(message);
      } catch (err) {
        this.handleError(err);
      }

    const channelID = quiz && quiz.channel_id ? quiz.channel_id : null;

    if (quiz && message.channel.id === channelID)
      try {
        const quizModule = require('../functions/quiz'); // eslint-disable-line global-require
        quizModule.readAnswer(client, message);
      } catch (err) {
        this.handleError(err);
      }

    const content = message.content;
    const author = message.author;
    const clientRegex = new RegExp(`^<@!?${client.user.id}>`);
    const mentioned = clientRegex.test(content);

    if (!(content.startsWith(prefix) || mentioned)) return;

    const args = mentioned ? content.split(/ +/g).slice(1) : content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    command = client.commands.get(command) || client.commands.filter(c => c.aliases && c.aliases.includes(command)).first();

    if (!command) return;

    const authorized = command.authorizedUsers;

    if (authorized.length && !authorized.includes(author.id)) return;

    try {
      if (command.awaitingPrompt) {
        if (client.awaitingUsers.get(author.id))
          return message.reply('you have an existing command currently waiting for your response. Say "cancel" before using this command.');

        client.awaitingUsers.set(author.id, true);
      }

      const dialog = await command.run(message, args);

      if (dialog)
        command.promptClearDialog(message, dialog);

      if (command.awaitingPrompt)
        client.awaitingUsers.delete(author.id);
    } catch (err) {
      this.handleError(err);

      message.channel.send([
        `Sorry, something happened: \`${err.message}\`\n\n`,
        'If this is a feature-breaking issue, please contact: ',
        `${owners
          ? owners.map(o => `\`${client.users.get(o).tag}\``).join(', ')
          : 'No bot developers were in the configuration'}\n`,
        `Or proceed to this Discord invite code: \`${discord_code
          ? discord_code
          : 'No invite code was in the configuration'}\``
      ].join(''));

      throw (err);
    }
  }
}

module.exports = MessageEvent;
