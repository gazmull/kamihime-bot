const Helper = require('../Helper');
const mysql = require('mysql2/promise');

class DBConfigHelper extends Helper {
  init() {
    const {
      client,
      client: {
        config: {
          mysql: {
            host = null,
            user = null,
            password = null,
            database = null
          }
        }
      }
    } = this;
    const pool = mysql.createPool({
      host,
      user,
      password,
      database,
      supportBigNumbers: true,
      bigNumberStrings: true
    });
    client.db = pool;

    this.logger('info', 'Users Database intialised.');

    return true;
  }
}

module.exports = DBConfigHelper;
