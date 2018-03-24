const quiz = require('../functions/quiz');

const Event = require('../struct/Event');

class ReadyEvent extends Event {
  constructor(client) {
    super(client, { name: 'ready' });
  }

  async run() {
    const { client, client: { config, config: { prefix } } } = this;

    this.logger('info', `Bot has started with ${client.users.size} users in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    await client.user.setActivity(`say ${prefix}help | ${client.guilds.size} servers`, { type: 'WATCHING' });

    if (config.hasOwnProperty('quiz')) {
      quiz.initQuestion(client);
      client.quiz = quiz;
    }
  }
}

module.exports = ReadyEvent;
