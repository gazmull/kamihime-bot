
const     config    = require("./config.json");
const     KHdatas   = require('./datas/kamihime.json');
const     EDdatas   = require('./datas/eidolons.json');
const     SLdatas   = require('./datas/souls.json');
const     WPdatas   = require('./datas/weapons.json');
const     ACdatas   = require('./datas/accessories.json');
const     crypto    = require('crypto');

var       ALLArray  = [];
var       KHArray   = [];
var       EDArray   = [];
var       SLArray   = [];
var       WPArray   = [];
var       ACArray   = [];

exports.getKHInfos   = () => {
  return ALLArray;
}
exports.getKamihimeInfos   = () => {
  return KHArray;
}
exports.getEidolonInfos   = () => {
  return EDArray;
}
exports.getSoulInfos   = () => {
  return SLArray;
}
exports.getWeaponInfos   = () => {
  return WPArray;
}
exports.getAccessoryInfos   = () => {
  return ACArray;
}


// --- merge everything in one big ALLArray

exports.initKHInfos     = () =>  {

  KHArray = Object.keys(KHdatas).map(function (key) { return KHdatas[key]; });
  for (var i = 0; i < KHArray.length; i++){
    KHArray[i].objectType = "Kamihime";
  }
  EDArray = Object.keys(EDdatas).map(function (key) { return EDdatas[key]; });
  for (var i = 0; i < EDArray.length; i++){
    EDArray[i].objectType = "Eidolon";
  }
  SLArray = Object.keys(SLdatas).map(function (key) { return SLdatas[key]; });
  for (var i = 0; i < SLArray.length; i++){
    SLArray[i].objectType = "Soul";
  }
  WPArray = Object.keys(WPdatas).map(function (key) { return WPdatas[key]; });
  for (var i = 0; i < WPArray.length; i++){
    WPArray[i].objectType = "Weapon";
  }
  ACArray = Object.keys(ACdatas).map(function (key) { return ACdatas[key]; });
  for (var i = 0; i < ACArray.length; i++){
    ACArray[i].objectType = "Accessory";
  }

  ALLArray = KHArray.concat(ACArray, EDArray, SLArray, WPArray);
  ALLArray.sort(function(a, b) {
      var keyA = new Date(a.timestamp);
      var keyB = new Date(b.timestamp);
      if(keyA > keyB) return -1;
      if(keyA < keyB) return 1;
      return 0;
  });
}

exports.encrypt =  (plain_text) => {
    const encryptionMethod  = 'AES-256-CBC';
    const secret            = config.secret_key;      //must be 32 char length
    const relativeUrl       = plain_text
    if (secret){
      const iv                = secret.substr(0,16);
      const encryptor         = crypto.createCipheriv(encryptionMethod, secret, iv);
      const encrypted         = encryptor.update(plain_text, 'utf8', 'base64') + encryptor.final('base64');
      return Buffer.from(encrypted).toString('base64')
    }
    return null;
}
