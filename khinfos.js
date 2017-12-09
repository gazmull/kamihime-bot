
const     KHdatas   = require('./datas/kamihime.json');
const     EDdatas   = require('./datas/eidolons.json');
const     SLdatas   = require('./datas/souls.json');
const     WPdatas   = require('./datas/weapons.json');
var       ALLArray  = [];

exports.getKHInfos   = () => {
  return ALLArray;
}

// --- merge everything in one big ALLArray

exports.initKHInfos     = () =>  {

  var     KHArray = Object.keys(KHdatas).map(function (key) { return KHdatas[key]; });
  for (var i = 0; i < KHArray.length; i++){
    KHArray[i].objectType = "Kamihime";
  }
  var     EDArray = Object.keys(EDdatas).map(function (key) { return EDdatas[key]; });
  for (var i = 0; i < EDArray.length; i++){
    EDArray[i].objectType = "Eidolon";
  }
  var     SLArray = Object.keys(SLdatas).map(function (key) { return SLdatas[key]; });
  for (var i = 0; i < SLArray.length; i++){
    SLArray[i].objectType = "Soul";
  }
  var     WPArray = Object.keys(WPdatas).map(function (key) { return WPdatas[key]; });
  for (var i = 0; i < WPArray.length; i++){
    WPArray[i].objectType = "Weapon";
  }
  ALLArray = KHArray.concat(EDArray, SLArray, WPArray);
  ALLArray.sort(function(a, b) {
      var keyA = new Date(a.timestamp);
      var keyB = new Date(b.timestamp);
      if(keyA > keyB) return -1;
      if(keyA < keyB) return 1;
      return 0;
  });
}
