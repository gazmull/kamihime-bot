const Helper = require('../Helper');
const mysql = require('mysql2/promise');

class DBConfigHelper extends Helper {
  init() {
    const {
      client,
      client: {
        config: {
          mysql: {
            host,
            user,
            password,
            database
          }
        }
      }
    } = this;
    const pool = mysql.createPool({
      host: host || null,
      user: user || null,
      password: password || null,
      database: database || null,
      supportBigNumbers: true,
      bigNumberStrings: true
    });
    client.db = pool;

    this.logger('info', 'Users Database intialised.');

    return true;
  }
}

module.exports = DBConfigHelper;
