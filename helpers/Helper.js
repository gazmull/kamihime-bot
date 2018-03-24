const fs = require('fs');
const { Collection } = require('discord.js');

class Helper {
  constructor(client) {
    this.client = client;

    this.util = {
      config: client.config,
      collection: this.collection
    };
  }

  /**
   * @returns {Collection}
   */
  collection() {
    return new Collection();
  }

  async init() {
    const client = this.client;
    const files = fs.readdirSync('./helpers/modules');
    let loaded = 0;

    for (const fileName of files)
      try {
        const file = new (require(`${process.cwd()}/helpers/modules/${fileName}`))(client); // eslint-disable-line global-require
        await file.init();

        loaded++;
      } catch (err) {
        this.logger('error', err);
      }

    this.logger('info', `${loaded} helpers have been loaded. (Expected: ${files.length})`);

    return client.login(client.config.token);
  }

  handleError(err) {
    this.logger('error', err);

    throw err;
  }

  logger(type, message) {
    const { client } = this;
    let { constructor: { name } } = this;
    name = name.slice(0, name.indexOf('Helper'));

    switch (type) {
      case 'error':
        client.logger.error(`Helper - ${name}: ${message}`);
        break;
      case 'warn':
        client.logger.warn(`Helper - ${name}: ${message}`);
        break;
      default:
        client.logger.info(`Helper - ${name}: ${message}`);
    }
  }
}

module.exports = Helper;
