const Helper = require('../Helper');
const { secret_key: secret } = require('../../config.json');
const { createCipheriv } = require('crypto');

const himeData = require('../../datas/kamihime.json');
const eidoData = require('../../datas/eidolons.json');
const soulData = require('../../datas/souls.json');
const weapData = require('../../datas/weapons.json');
const acceData = require('../../datas/accessories.json');

let all = [];
let himes = [];
let eidos = [];
let souls = [];
let weaps = [];
let acces = [];

class KHDatabaseHelper extends Helper {
  encrypt(text) {
    if (secret) {
      const method = 'AES-256-CBC';
      const iv = secret.substr(0, 16);
      const encryptor = createCipheriv(method, secret, iv);
      const encrypted = encryptor.update(text, 'utf8', 'base64') + encryptor.final('base64');

      return Buffer.from(encrypted).toString('base64');
    }

    return null;
  }

  init() {
    const { client } = this;
    himes = Object.keys(himeData).map(key => himeData[key]);
    eidos = Object.keys(eidoData).map(key => eidoData[key]);
    souls = Object.keys(soulData).map(key => soulData[key]);
    weaps = Object.keys(weapData).map(key => weapData[key]);
    acces = Object.keys(acceData).map(key => acceData[key]);

    for (const hime of himes)
      hime.objectType = 'Kamihime';
    for (const eido of eidos)
      eido.objectType = 'Eidolon';
    for (const soul of souls)
      soul.objectType = 'Soul';
    for (const weap of weaps)
      weap.objectType = 'Weapon';
    for (const acce of acces)
      acce.objectType = 'Accessory';

    all = himes.concat(eidos, souls, weaps, acces);

    all.sort((a, b) => {
      const keyA = new Date(a.timestamp).getTime();
      const keyB = new Date(b.timestamp).getTime();

      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;

      return 0;
    });

    client.khDB = {
      all: () => all,
      kamihime: () => himes,
      eidolon: () => eidos,
      soul: () => souls,
      weapon: () => weaps,
      accessory: () => acces,
      encrypt: this.encrypt
    };

    this.logger(
      'info',
      `Loaded [ALL: ${all.length} | KHIME: ${himes.length} | EIDO: ${eidos.length} | SOUL: ${souls.length} | WEAP: ${weaps.length} | ACCE: ${acces.length}]`
    );

    return true;
  }
}

module.exports = KHDatabaseHelper;
