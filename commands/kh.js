// Return Simple Kamihime datasheet scrapped from kamihime-project.wikia.com
// Currently supported items: Kamihimes Eidolons & Souls

var   KHdatas = require('../datas/kamihime.json');
var   EDdatas = require('../datas/eidolons.json');
var   SLdatas = require('../datas/souls.json');
const Discord = require("discord.js");
const config  = require("../config.json");

exports.run = (client, message, args) => {
  var khfound = false;
  var khname  = args.join(" ");
  khname      = khname.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );

  // --- Kamihimes

  if(KHdatas.hasOwnProperty(khname))
  {
    var kh_name           = KHdatas[khname].name;
    var kh_link           = config.wikidomain+KHdatas[khname].link;
    var kh_thumb          = config.thumbrooturl+KHdatas[khname].thumb;
    var kh_raritythumb    = config.thumbrooturl+KHdatas[khname].raritythumb;
    var kh_rarity         = KHdatas[khname].rarity;
    var kh_elementthumb   = config.thumbrooturl+KHdatas[khname].elementthumb;
    var kh_element        = KHdatas[khname].element;
    var kh_classthumb     = config.thumbrooturl+KHdatas[khname].classthumb;
    var kh_attackMin      = KHdatas[khname].attackMin;
    var kh_attackMax      = KHdatas[khname].attackMax;
    var kh_HPMin          = KHdatas[khname].HPMin;
    var kh_HPMax          = KHdatas[khname].HPMax;
    var kh_totalPowerMin  = KHdatas[khname].totalPowerMin;
    var kh_totalPowerMax  = KHdatas[khname].totalPowerMax;

    const embed = new Discord.RichEmbed()
    .setTitle(config.eimojis[kh_rarity]+" "+config.eimojis[kh_element])
    .setAuthor("Kamihime: "+kh_name, "")
    .setColor("#00AE86")
    .setThumbnail(kh_thumb)
    .setURL(kh_link)
    .setImage(kh_classthumb)
    .addField("Statistics:", ":crossed_swords: " + kh_attackMin + " - " + kh_attackMax + "    :green_heart: " + kh_HPMin + " - " + kh_HPMax + "    :muscle: " + kh_totalPowerMin + " - " + kh_totalPowerMax, false);
    message.channel.send({embed});
    khfound = true;
  }

  // --- eidolons

  if(EDdatas.hasOwnProperty(khname))
  {
    var ed_name           = EDdatas[khname].name;
    var ed_link           = config.wikidomain+EDdatas[khname].link;
    var ed_thumb          = config.thumbrooturl+EDdatas[khname].thumb;
    var ed_raritythumb    = config.thumbrooturl+EDdatas[khname].raritythumb;
    var ed_rarity         = EDdatas[khname].rarity;
    var ed_elementthumb   = config.thumbrooturl+EDdatas[khname].elementthumb;
    var ed_element        = EDdatas[khname].element;
    var ed_attackMin      = EDdatas[khname].attackMin;
    var ed_attackMax      = EDdatas[khname].attackMax;
    var ed_HPMin          = EDdatas[khname].HPMin;
    var ed_HPMax          = EDdatas[khname].HPMax;
    var ed_totalPowerMin  = EDdatas[khname].totalPowerMin;
    var ed_totalPowerMax  = EDdatas[khname].totalPowerMax;

    const embed = new Discord.RichEmbed()
    .setTitle(config.eimojis[ed_rarity]+" "+config.eimojis[ed_element])
    .setAuthor("Eidolon: "+ed_name, "")
    .setColor("#00AE86")
    .setThumbnail(ed_thumb)
    .setURL(ed_link)
    .addField("Statistics:", ":crossed_swords: " + ed_attackMin + " - " + ed_attackMax + "    :green_heart: " + ed_HPMin + " - " + ed_HPMax + "    :muscle: " + ed_totalPowerMin + " - " + ed_totalPowerMax, false);
    message.channel.send({embed});
    khfound = true;
  }

  // --- Souls

  if(SLdatas.hasOwnProperty(khname))
  {
    var sl_name           = SLdatas[khname].name;
    var sl_link           = config.wikidomain+SLdatas[khname].link;
    var sl_thumb          = config.thumbrooturl+SLdatas[khname].thumb;
    var sl_rarity         = SLdatas[khname].rarity;
    var sl_classthumb     = config.thumbrooturl+SLdatas[khname].classthumb;
    var sl_subType        = SLdatas[khname].subType;
    var sl_weapons1       = SLdatas[khname].weapons1;
    var sl_weapons2       = SLdatas[khname].weapons2;
    var sl_releaseCost    = SLdatas[khname].releaseCost;

    const embed = new Discord.RichEmbed()
    .setTitle(sl_rarity+" - "+sl_subType)
    .setAuthor("Soul: "+sl_name, "")
    .setColor("#00AE86")
    .setThumbnail(sl_thumb)
    .setURL(sl_link)
    .setImage(sl_classthumb)
    .addField("Weapons:",sl_weapons1+" - "+sl_weapons2, false)
    .addField("Release Cost:", sl_releaseCost, false);
    message.channel.send({embed});
    khfound = true;
  }

  if( khfound == false)
  {
    message.channel.send("I don't know '"+khname+"'");
  }
}
