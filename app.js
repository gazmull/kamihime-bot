const { Client } = require('discord.js');
const Helper = require('./helpers/Helper');

// This is your client. Some people call it `bot`, some people call it `self`
class KamihimeClient extends Client {
  constructor() {
    super({
      disabledEvents: ['TYPING_START'],
      disableEveryone: true
    });

    /* eslint-disable global-require */

    this.config = require('./config.json');
    this.logger = require('./utils/logger');

    /* eslint-enable global-require */
  }
}

const client = new KamihimeClient();

// "Locks and loads" the client
new Helper(client).init();

client
  .on('error', err => client.logger.error(`Client: ${err}`))
  .on('warn', warn => client.logger.warn(`Client: ${warn}`));

process.on('unhandledRejection', console.error);
