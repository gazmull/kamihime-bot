// Return Simple Kamihime datasheets.
// Currently supported items: Kamihimes Eidolons & Souls

var   KHdatas = require('../datas/kamihime.json');
var   EDdatas = require('../datas/eidolons.json');
var   SLdatas = require('../datas/souls.json');
const Discord = require("discord.js");
const config  = require("../config.json");

exports.run     = (client, message, args) => {
  var khfound   = false;
  var khrequest = args.join(" ");
  khrequest     = khrequest.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );

  if (khrequest.length < 3)
  {
    message.channel.send("I need at least 3 characters to help you.");
    return;
  }

  var khnameList = [];

  if ( KHdatas.hasOwnProperty(khrequest) ||
       EDdatas.hasOwnProperty(khrequest) ||
       SLdatas.hasOwnProperty(khrequest) ) {
      // --- Exact match
      khnameList.push(khrequest);
  }
  else {

    // --- Try to match results with the provided request

    for (var key in KHdatas) {
      if(key.indexOf(khrequest) == 0) {
          khnameList.push(key);
      }
    }
    for (var key in EDdatas) {
      if(key.indexOf(khrequest) == 0) {
          khnameList.push(key);
      }
    }
    for (var key in SLdatas) {
      if(key.indexOf(khrequest) == 0) {
          khnameList.push(key);
      }
    }
  }

  // --- Main Loop for Kamihimes, Eidolons & Souls

  for (khIndex = 0; khIndex < khnameList.length; ++khIndex)
  {

    // Limit the bot to 3 responses
    if ( khIndex > 2) {
      message.channel.send("```There's too much results. Please try to narrow your search```");
      return;
    }

    var khname = khnameList[khIndex];

    // --- Kamihimes

    if(KHdatas.hasOwnProperty(khname))
    {
      var kh_name           = KHdatas[khname].name;
      var kh_link           = config.wikidomain+KHdatas[khname].link;
      var kh_thumb          = config.thumbrooturl+KHdatas[khname].thumb;
      var kh_image          = config.thumbrooturl+KHdatas[khname].image;
      var kh_raritythumb    = config.thumbrooturl+KHdatas[khname].raritythumb;
      var kh_rarity         = KHdatas[khname].rarity;
      var kh_elementthumb   = config.thumbrooturl+KHdatas[khname].elementthumb;
      var kh_element        = KHdatas[khname].element;
      var kh_class          = KHdatas[khname].class;
      var kh_attackMin      = KHdatas[khname].attackMin;
      var kh_attackMax      = KHdatas[khname].attackMax;
      var kh_HPMin          = KHdatas[khname].HPMin;
      var kh_HPMax          = KHdatas[khname].HPMax;
      var kh_totalPowerMin  = KHdatas[khname].totalPowerMin;
      var kh_totalPowerMax  = KHdatas[khname].totalPowerMax;

      const embed = new Discord.RichEmbed()
      .setTitle(config.eimojis[kh_rarity]+" "+config.eimojis[kh_element]+" ("+kh_class+")")
      .setAuthor("Kamihime: "+kh_name, "")
      .setColor("#00AE86")
      .setDescription("*"+KHdatas[khname].description+"*")
      .setThumbnail(kh_thumb)
      .setURL(kh_link)
      .setImage(kh_image)
      .addField("Statistics:", ":crossed_swords: " + kh_attackMin + " - " + kh_attackMax + "    :green_heart: " + kh_HPMin + " - " + kh_HPMax + "    :muscle: " + kh_totalPowerMin + " - " + kh_totalPowerMax, false);

      if (KHdatas[khname].burst){
        var burstdesc = KHdatas[khname].burstdesc.replace("\u2605","\n\u2605");
        embed.addField(":b: "+KHdatas[khname].burst,burstdesc,false)
      }
      if (KHdatas[khname].ability1){
        var abilitydesc1 = KHdatas[khname].abilitydesc1.replace("\u2605","\n\u2605");
        var abilitycool1 = KHdatas[khname].abilitycool1.replace('Cooldown:',':battery:');
        abilitycool1 = abilitycool1.replace('Duration:',':hourglass:');
        embed.addField(":regional_indicator_a: "+KHdatas[khname].ability1+" "+abilitycool1,abilitydesc1,false)
      }
      if (KHdatas[khname].ability2){
        var abilitydesc2 = KHdatas[khname].abilitydesc2.replace("\u2605","\n\u2605");
        var abilitycool2 = KHdatas[khname].abilitycool2.replace('Cooldown:',':battery:');
        abilitycool2 = abilitycool2.replace('Duration:',':hourglass:');
        embed.addField(":regional_indicator_a: "+KHdatas[khname].ability2+" "+abilitycool2,abilitydesc2,false)
      }
      if (KHdatas[khname].ability3){
        var abilitydesc3 = KHdatas[khname].abilitydesc3.replace("\u2605","\n\u2605");
        var abilitycool3 = KHdatas[khname].abilitycool3.replace('Cooldown:',':battery:');
        abilitycool3 = abilitycool3.replace('Duration:',':hourglass:');
        embed.addField(":regional_indicator_a: "+KHdatas[khname].ability3+" "+abilitycool3,abilitydesc3,false)
      }
      if (KHdatas[khname].assist){
        embed.addField(":white_check_mark: "+KHdatas[khname].assist,KHdatas[khname].assistdesc,false)
      }

      embed.addField("Obtained from:",KHdatas[khname].obtained,false);
      if (KHdatas[khname].weapon) {
        if (KHdatas[khname].weaponlink) {
          embed.addField("Released weapon:","["+KHdatas[khname].weapon+"]("+config.wikidomain+KHdatas[khname].weaponlink+")",false);
        }
        else {
          embed.addField("Released weapon:",KHdatas[khname].weapon,false);
        }
      }

      message.channel.send({embed});
      khfound = true;
    }

    // --- eidolons

    if(EDdatas.hasOwnProperty(khname))
    {
      var ed_name                     = EDdatas[khname].name;
      var ed_link                     = config.wikidomain+EDdatas[khname].link;
      var ed_thumb                    = config.thumbrooturl+EDdatas[khname].thumb;
      var ed_image                    = config.thumbrooturl+EDdatas[khname].image;
      var ed_raritythumb              = config.thumbrooturl+EDdatas[khname].raritythumb;
      var ed_rarity                   = EDdatas[khname].rarity;
      var ed_elementthumb             = config.thumbrooturl+EDdatas[khname].elementthumb;
      var ed_element                  = EDdatas[khname].element;
      var ed_attackMin                = EDdatas[khname].attackMin;
      var ed_attackMax                = EDdatas[khname].attackMax;
      var ed_HPMin                    = EDdatas[khname].HPMin;
      var ed_HPMax                    = EDdatas[khname].HPMax;
      var ed_totalPowerMin            = EDdatas[khname].totalPowerMin;
      var ed_totalPowerMax            = EDdatas[khname].totalPowerMax;
      var ed_summonAttack             = EDdatas[khname].summonAttack.replace("Summon Attack",":a: Summon Attack");
      var ed_summonAttackEffect       = EDdatas[khname].summonAttackEffect;
      var ed_summonAttackCooldown     = EDdatas[khname].summonAttackCooldown;
      var ed_eidolonsEffect           = EDdatas[khname].eidolonsEffect.replace("Eidolon Effect",":regional_indicator_e: Eidolon Effect");
      var ed_eidolonEffectTier0Stars  = EDdatas[khname].eidolonEffectTier0Stars;
      var ed_eidolonEffectTier0Effect = EDdatas[khname].eidolonEffectTier0Effect;
      var ed_eidolonEffectTier1Stars  = EDdatas[khname].eidolonEffectTier1Stars;
      var ed_eidolonEffectTier1Effect = EDdatas[khname].eidolonEffectTier1Effect;
      var ed_eidolonEffectTier2Stars  = EDdatas[khname].eidolonEffectTier2Stars;
      var ed_eidolonEffectTier2Effect = EDdatas[khname].eidolonEffectTier2Effect;
      var ed_eidolonEffectTier3Stars  = EDdatas[khname].eidolonEffectTier3Stars;
      var ed_eidolonEffectTier3Effect = EDdatas[khname].eidolonEffectTier3Effect;
      var ed_eidolonEffectTier4Stars  = EDdatas[khname].eidolonEffectTier4Stars;
      var ed_eidolonEffectTier4Effect = EDdatas[khname].eidolonEffectTier4Effect;


      const embed = new Discord.RichEmbed()
      .setTitle(config.eimojis[ed_rarity]+" "+config.eimojis[ed_element])
      .setAuthor("Eidolon: "+ed_name, "")
      .setColor("#00AE86")
      .setThumbnail(ed_thumb)
      .setURL(ed_link)
      .addField("Statistics:", ":crossed_swords: " + ed_attackMin + " - " + ed_attackMax + "    :green_heart: " + ed_HPMin + " - " + ed_HPMax + "    :muscle: " + ed_totalPowerMin + " - " + ed_totalPowerMax, false);

      if (EDdatas[khname].description) {
        embed.setDescription("*"+EDdatas[khname].description+"*")
      }

      if (ed_summonAttack.length && ed_summonAttackEffect.length) {
        embed.addField(ed_summonAttack + " (" + ed_summonAttackCooldown + ")", ed_summonAttackEffect,false);
      }

      if (ed_eidolonsEffect.length) {
        embed.addField(ed_eidolonsEffect, ed_eidolonEffectTier0Stars+" "+ed_eidolonEffectTier0Effect+"\n"+
          ed_eidolonEffectTier1Stars+" "+ed_eidolonEffectTier1Effect+"\n"+
          ed_eidolonEffectTier2Stars+" "+ed_eidolonEffectTier2Effect+"\n"+
          ed_eidolonEffectTier3Stars+" "+ed_eidolonEffectTier3Effect+"\n"+
          ed_eidolonEffectTier4Stars+" "+ed_eidolonEffectTier4Effect+"\n"
          ,false);
      }

      if (EDdatas[khname].obtained) {
        embed.addField("Obtained from:",EDdatas[khname].obtained,false);
      }
      if (ed_image) {
        embed.setImage(ed_image);
      }

      message.channel.send({embed});
      khfound = true;
    }

    // --- Souls

    if(SLdatas.hasOwnProperty(khname))
    {
      var sl_name           = SLdatas[khname].name;
      var sl_link           = config.wikidomain+SLdatas[khname].link;
      var sl_thumb          = config.thumbrooturl+SLdatas[khname].thumb;
      var sl_image          = config.thumbrooturl+SLdatas[khname].image;
      var sl_rarity         = SLdatas[khname].rarity;
      var sl_classthumb     = config.thumbrooturl+SLdatas[khname].classthumb;
      var sl_class          = SLdatas[khname].class;
      var sl_subType        = SLdatas[khname].subType;
      var sl_weapons1       = SLdatas[khname].weapons1;
      var sl_weapons2       = SLdatas[khname].weapons2;
      var sl_releaseCost    = SLdatas[khname].releaseCost;
      var sl_releaseCond    = SLdatas[khname].releasecondition;
      var sl_description    = "*"+SLdatas[khname].description+"*";

      sl_description        += "\n\n__**Favourite Weapons:**__  "+sl_weapons1+" - "+sl_weapons2;
      sl_description        += "\n__**Master Bonus:**__  "+SLdatas[khname].masterbonus;
      sl_description        += "\n__**Release Conditions:**__  "+sl_releaseCond;
      sl_description        += "\n__**Bonus At Maximum Level:**__  "+SLdatas[khname].totalbonus;

      const embed = new Discord.RichEmbed()
      .setTitle(sl_rarity+" - "+sl_subType+" ("+sl_class+")")
      .setAuthor("Soul: "+sl_name, "")
      .setColor("#00AE86");

      if (sl_description){
        embed.setDescription(sl_description);
      }
      if (sl_thumb){
        embed.setThumbnail(sl_thumb);
      }
      if (sl_link){
        embed.setURL(sl_link);
      }
      if (sl_image){
        embed.setImage(sl_image);
      }

      if (SLdatas[khname].burst){
        var burstdesc = SLdatas[khname].burstdesc.replace("\u2605","\n\u2605");
        embed.addField(":b: "+SLdatas[khname].burst,burstdesc,false)
      }
      if (SLdatas[khname].ability1){
        var abilitydesc1 = SLdatas[khname].abilitydesc1.replace("\u2605","\n\u2605");
        var abilitycool1 = SLdatas[khname].abilitycool1.replace('Cooldown:',':battery:');
        abilitycool1 = abilitycool1.replace('Duration:',':hourglass:');
        embed.addField(":regional_indicator_a: "+SLdatas[khname].ability1+" "+abilitycool1,abilitydesc1,false)
      }
      if (SLdatas[khname].ability2){
        var abilitydesc2 = SLdatas[khname].abilitydesc2.replace("\u2605","\n\u2605");
        var abilitycool2 = SLdatas[khname].abilitycool2.replace('Cooldown:',':battery:');
        var unlock2      = SLdatas[khname].abilityunlock2.replace('Unlocks at',':unlock:');
        abilitycool2 = abilitycool2.replace('Duration:',':hourglass:');
        embed.addField(":regional_indicator_a: "+SLdatas[khname].ability2+" "+abilitycool2+" "+unlock2,abilitydesc2,false)
      }
      if (SLdatas[khname].ability3){
        var abilitydesc3 = SLdatas[khname].abilitydesc3.replace("\u2605","\n\u2605");
        var abilitycool3 = SLdatas[khname].abilitycool3.replace('Cooldown:',':battery:');
        var unlock3      = SLdatas[khname].abilityunlock3.replace('Unlocks at',':unlock:');
        abilitycool3 = abilitycool3.replace('Duration:',':hourglass:');
        embed.addField(":regional_indicator_a: "+SLdatas[khname].ability3+" "+abilitycool3+" "+unlock3,abilitydesc3,false)
      }
      if (SLdatas[khname].assist1){
        embed.addField(":white_check_mark: "+SLdatas[khname].assist1,SLdatas[khname].assistdesc1,false)
      }
      if (SLdatas[khname].assist2){
        embed.addField(":white_check_mark: "+SLdatas[khname].assist2,SLdatas[khname].assistdesc2,false)
      }



      message.channel.send({embed});
      khfound = true;
    }
  }

  // --- Nothing found

  if( khfound == false)
  {
    message.channel.send("I don't know '"+khrequest+"'");
  }
}
