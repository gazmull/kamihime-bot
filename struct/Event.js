class Event {

  /**
   * Options for Event.
   * @typedef {Object} EventOptions
   * @property {string} name Name of the event.
   */

  /**
   * @param {Client} client Instance of the client.
   * @param {EventOptions} [options={}] Options for Event.
   */
  constructor(client, options = {}) {
    if (!(options instanceof Object)) throw new TypeError('Event.options must be an object type.');

    this.client = client;

    this.name = options.name;

    this.util = { config: client.config };

    this.prefix = this.util.config.prefix;
  }

  handleError(err) {
    this.logger('error', err);

    throw err;
  }

  logger(type, message) {
    const { client } = this;
    let { constructor: { name } } = this;
    name = name.slice(0, name.indexOf('Event'));

    switch (type) {
      case 'error':
        client.logger.error(`Event - ${name}: ${message}`);
        break;
      case 'warn':
        client.logger.warn(`Event - ${name}: ${message}`);
        break;
      default:
        client.logger.info(`Event - ${name}: ${message}`);
    }
  }

  run() {
    throw new Error('Cannot invoke this class with run().');
  }
}

module.exports = Event;
