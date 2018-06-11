const { Collection, RichEmbed } = require('discord.js');

class Command {

  /**
   * Options for Command.description.
   * @typedef {Object} DescriptionOptions
   * @property {string} content General description of the command.
   * @property {Array.<string>} examples Examples for the command's arguments.
   * @property {string} usage Proper usage of the command.
   */

  /**
   * Options for Command.
   * @typedef {Object} CommandOptions
   * @property {string} name Name of the command.
   * @property {Array} aliases Aliases of the command.
   * @property {DescriptionOptions} [description={}] Description of the command.
   * @property {Array} [permissions=[]] Permissions for the client to execute this command.
   * @property {Array} [authorizedUsers=[]] Authorized users to execute this command.
   * @property {boolean} [awaitingPrompt=false] Whether this command should trigger 'Add user to awaitingUsers collection' or not.
   */

  /**
   * @param {Client} client Instance of the client.
   * @param {CommandOptions} [options={}] Options for Command.
   */
  constructor(client, options = {}) {
    if (!(options instanceof Object)) throw new TypeError('Command.options must be an object type.');

    /**
     * @type {Client}
     */
    this.client = client;

    /**
     * @type {string}
     */
    this.name = options.name || null;

    /**
     * @type {Array.<string>}
     */
    this.aliases = options.aliases || [];

    /**
     * @type {DescriptionOptions}
     */
    this.description = options.description || {};

    /**
     * @type {Array.<string>}
     */
    this.permissions = options.permissions || [];

    /**
     * @type {Array.<User.id>}
     */
    this.authorizedUsers = options.authorizedUsers || [];

    /**
     * @type {boolean}
     */
    this.awaitingPrompt = options.awaitingPrompt || false;

    this.util = {
      config: client.config,
      collection: this.collection,
      embed: this.embed
    };

    this.prefix = this.util.config.prefix;
  }

  /**
   * @returns {Collection}
   */
  collection() {
    return new Collection();
  }

  /**
   * @returns {RichEmbed}
   */
  embed() {
    return new RichEmbed();
  }

  handleError(err) {
    this.logger('error', err);
  }

  logger(type, message) {
    const { client } = this;
    let { constructor: { name } } = this;
    name = name.slice(0, name.indexOf('Command'));

    switch (type) {
      case 'error':
        client.logger.error(`Command - ${name}: ${message}`);
        break;
      case 'warn':
        client.logger.warn(`Command - ${name}: ${message}`);
        break;
      default:
        client.logger.info(`Command - ${name}: ${message}`);
    }
  }

  async promptClearDialog(message, dialog) {
    if (!message.guild) return;

    const permissions = (
      message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES') &&
      message.channel.permissionsFor(message.client.user).has('ADD_REACTIONS') &&
      message.channel.permissionsFor(message.client.user).has('READ_MESSAGE_HISTORY')
    );

    if (!permissions) return;

    try {
      await dialog.react('🗑');
      const toDelete = await dialog.awaitReactions((r, u) =>
        r.emoji.name === '🗑' && u.id === message.author.id, { max: 1, time: 30 * 1000, errors: ['time'] });

      if (toDelete.first())
        await dialog.delete();
    } catch (c) {
      if (c instanceof Error) this.handleError(c);

      await dialog.clearReactions().catch();
    }
  }

  run(message, args) { // eslint-disable-line no-unused-vars
    throw new Error('Cannot invoke this class with run().');
  }
}

module.exports = Command;
