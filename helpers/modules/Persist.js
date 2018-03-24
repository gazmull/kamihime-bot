const Helper = require('../Helper');
const persist = require('node-persist');

class PersistHelper extends Helper {
  async init() {
    const { client } = this;

    persist.initSync({ dir: client.config.node_persist_path });

    const countdowns = await persist.get('countdowns');

    if (Object.keys(countdowns).length)
      this.logger('info', `Initialised Countdowns length: ${Object.keys(countdowns).length}`);
    else {
      await persist.set('countdowns', {});

      this.logger('info', 'Countdowns value was undefined, initialized to {}');
    }

    const bakas = persist.get('bakas');

    if (bakas.length)
      this.logger('info', `Initialised Bakas length: ${bakas.length}`);
    else {
      await persist.set('bakas', []);

      this.logger('info', 'Bakas value was undefined, initialized to []');
    }

    client.persist = persist;

    return true;
  }
}

module.exports = PersistHelper;
