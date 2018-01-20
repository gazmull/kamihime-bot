// Return the n latest updates for Kamihimes Eidolons Weapons & Souls

const   config  = require("../config.json");
const   khinfos = require("../utils/khinfos");

let     nbResultToDisplay = 15;
const   dataArray = khinfos.getKHInfos();
const   khArray   = khinfos.getKamihimeInfos();
const   edArray   = khinfos.getEidolonInfos();
const   slArray   = khinfos.getSoulInfos();
const   wpArray   = khinfos.getWeaponInfos();
const   acArray   = khinfos.getAccessoryInfos();

exports.run     = (client, message, args) => {

  let khrequest = args.join(" ");

  if (khrequest && (parseInt(khrequest)>0)) {
    nbResultToDisplay = parseInt(khrequest);
    if (nbResultToDisplay>15) nbResultToDisplay=15;
  }

  let latestResponse = "```Markdown\n";
  for (let i=0; i<nbResultToDisplay; i++) {
      let link = config.wikidomain+dataArray[i]['link'];
      latestResponse += dataArray[i]['timestamp']+" ["+dataArray[i]['name']+"]("+dataArray[i]['objectType']+")\n";
  }
  latestResponse +="```";
  message.channel.send(latestResponse);
  let stats = "```Markdown\n";
  stats +="Totals: [Kamihime]("+khArray.length+")"+" [Eidolon]("+edArray.length+")"+" [Soul]("+slArray.length+")"+" [Weapon]("+wpArray.length+")"+" [Accessory]("+acArray.length+")\n";
  stats +="```";
  message.channel.send(stats);

}
