const Helper = require('../Helper');
const fs = require('fs');

class EventsHelper extends Helper {
  init() {
    const { client } = this;
    const files = fs.readdirSync('./events/');
    let loaded = 0;

    for (const fileName of files) {
      const file = new (require(`${process.cwd()}/events/${fileName}`))(client); // eslint-disable-line global-require

      client.on(file.name, (...args) => file.run(...args));

      loaded++;
    }

    this.logger('info', `${loaded} events have been loaded. (Expected: ${files.length})`);

    return true;
  }
}

module.exports = EventsHelper;
