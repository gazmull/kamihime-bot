// Return the n latest updates for Kamihimes Eidolons Weapons & Souls

const   Discord = require("discord.js");
const   config  = require("../config.json");
const   khinfos = require("../khinfos.js");

let     nbResultToDisplay = 15;
const   khArray = khinfos.getKHInfos();

exports.run     = (client, message, args) => {
  var khfound   = false;
  var khrequest = args.join(" ");

  if (khrequest && (parseInt(khrequest)>0)) {
    nbResultToDisplay = parseInt(khrequest);
    if (nbResultToDisplay>15) nbResultToDisplay=15;
  }

  var latestResponse = "```Markdown\n"
  for (var i=0; i<nbResultToDisplay; i++) {
      var link = config.wikidomain+khArray[i]['link'];
      latestResponse += khArray[i]['timestamp']+' ['+khArray[i]['name']+"]("+khArray[i]['objectType']+")\n";
  }
  latestResponse +="```";
  message.channel.send(latestResponse);

}
