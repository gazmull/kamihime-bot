// Return Simple Kamihime datasheet scrapped from kamihime-project.wikia.com
// Currently supported items: Kamihimes & Eidolons
// Due to limited embed customization, server eimojis are used for a better rendering:
// Refers to eimoji.json to adapt to your server eimojis

var   KHdatas = require('../datas/kamihime.json');
var   EDdatas = require('../datas/eidolons.json');
var   Eimoji = require('../datas/eimoji/eimoji.json');
const Discord = require("discord.js");

exports.run = (client, message, args) => {
  var khfound = false;
  var khname  = args.join(" ");
  khname      = khname.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );

  // --- Kamihimes

  if(KHdatas.hasOwnProperty(khname))
  {
    var kh_name           = KHdatas[khname].name;
    var kh_link           = KHdatas[khname].link;
    var kh_thumb          = KHdatas[khname].thumb;
    var kh_raritythumb    = KHdatas[khname].raritythumb;
    var kh_rarity         = KHdatas[khname].rarity;
    var kh_elementthumb   = KHdatas[khname].elementthumb;
    var kh_element        = KHdatas[khname].element;
    var kh_classthumb     = KHdatas[khname].classthumb;
    var kh_attackMin      = KHdatas[khname].attackMin;
    var kh_attackMax      = KHdatas[khname].attackMax;
    var kh_HPMin          = KHdatas[khname].HPMin;
    var kh_HPMax          = KHdatas[khname].HPMax;
    var kh_totalPowerMin  = KHdatas[khname].totalPowerMin;
    var kh_totalPowerMax  = KHdatas[khname].totalPowerMax;

    const embed = new Discord.RichEmbed()
    .setTitle(Eimoji[kh_rarity]+" "+Eimoji[kh_element])
    .setAuthor("Kamihime: "+kh_name, "")
    .setColor("#00AE86")
    .setThumbnail(kh_thumb)
    .setURL("http://kamihime-project.wikia.com"+kh_link)
    .setImage(kh_classthumb)
    .addField("Statistics:", ":crossed_swords: " + kh_attackMin + " - " + kh_attackMax + "    :green_heart: " + kh_HPMin + " - " + kh_HPMax + "    :muscle: " + kh_totalPowerMin + " - " + kh_totalPowerMax, false);
    message.channel.send({embed});
    khfound = true;
  }

  // --- eidolons

  if(EDdatas.hasOwnProperty(khname))
  {
    var ed_name           = EDdatas[khname].name;
    var ed_link           = EDdatas[khname].link;
    var ed_thumb          = EDdatas[khname].thumb;
    var ed_raritythumb    = EDdatas[khname].raritythumb;
    var ed_rarity         = EDdatas[khname].rarity;
    var ed_elementthumb   = EDdatas[khname].elementthumb;
    var ed_element        = EDdatas[khname].element;
    var ed_attackMin      = EDdatas[khname].attackMin;
    var ed_attackMax      = EDdatas[khname].attackMax;
    var ed_HPMin          = EDdatas[khname].HPMin;
    var ed_HPMax          = EDdatas[khname].HPMax;
    var ed_totalPowerMin  = EDdatas[khname].totalPowerMin;
    var ed_totalPowerMax  = EDdatas[khname].totalPowerMax;

    const embed = new Discord.RichEmbed()
    .setTitle(Eimoji[ed_rarity]+" "+Eimoji[ed_element])
    .setAuthor("Eidolon: "+ed_name, "")
    .setColor("#00AE86")
    .setThumbnail(ed_thumb)
    .setURL("http://kamihime-project.wikia.com"+ed_link)
    .addField("Statistics:", ":crossed_swords: " + ed_attackMin + " - " + ed_attackMax + "    :green_heart: " + ed_HPMin + " - " + ed_HPMax + "    :muscle: " + ed_totalPowerMin + " - " + ed_totalPowerMax, false);
    message.channel.send({embed});
    khfound = true;
  }

  if( khfound == false)
  {
    message.channel.send("I don't know "+khname);
  }
}
