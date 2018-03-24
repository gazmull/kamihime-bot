const Helper = require('../Helper');
const fs = require('fs');

class CommandsHelper extends Helper {
  init() {
    const { client, util } = this;
    client.awaitingUsers = util.collection();
    client.commands = util.collection();

    const files = fs.readdirSync('./commands/');
    let loaded = 0;

    for (const fileName of files) {
      const file = new (require(`${process.cwd()}/commands/${fileName}`))(client); // eslint-disable-line global-require

      if (!file.name) continue;

      client.commands.set(file.name, file);

      loaded++;
    }

    this.logger('info', `${loaded} commands have been loaded. (Expected: ${files.length})`);

    return true;
  }
}

module.exports = CommandsHelper;
