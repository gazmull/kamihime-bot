// Return Simple Kamihime datasheets.
// Currently supported items: Kamihimes Eidolons & Souls

var   KHdatas = require('../datas/kamihime.json');
var   EDdatas = require('../datas/eidolons.json');
var   SLdatas = require('../datas/souls.json');
var   WPdatas = require('../datas/weapons.json');

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
       WPdatas.hasOwnProperty(khrequest) ||
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
    for (var key in WPdatas) {
      if(key.indexOf(khrequest) == 0) {
          khnameList.push(key);
      }
    }

  }

  // --- Main Loop for Kamihimes, Eidolons, Souls & Weapons

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
      var kh_thumb          = config.thumbrooturl+KHdatas[khname].portraiturl;
      var kh_image          = config.thumbrooturl+KHdatas[khname].imageurl;
      //var kh_raritythumb    = config.thumbrooturl+KHdatas[khname].raritythumb;
      var kh_rarity         = KHdatas[khname].rarity;
      //var kh_elementthumb   = config.thumbrooturl+KHdatas[khname].elementthumb;
      var kh_element        = KHdatas[khname].element;
      var kh_type          = KHdatas[khname].type;
      var kh_attackMin      = KHdatas[khname].atk_min;
      var kh_attackMax      = KHdatas[khname].atk_max;
      var kh_HPMin          = KHdatas[khname].hp_min;
      var kh_HPMax          = KHdatas[khname].hp_max;
      var kh_totalPowerMin  = parseInt(kh_HPMin)+parseInt(kh_attackMin);
      var kh_totalPowerMax  = parseInt(kh_HPMax)+parseInt(kh_attackMax);

      const embed = new Discord.RichEmbed()
      .setTitle(config.eimojis[kh_rarity]+" "+config.eimojis[kh_element+"Symbol"]+" ("+kh_type+")")
      .setAuthor("Kamihime: "+kh_name, "")
      .setColor("#00AE86")
      .setDescription("*"+KHdatas[khname].description+"*")
      .setThumbnail(kh_thumb)
      .setURL(kh_link)
      .setImage(kh_image)
      .addField("Statistics:", ":crossed_swords: " + kh_attackMin + " - " + kh_attackMax + "    :green_heart: " + kh_HPMin + " - " + kh_HPMax + "    :muscle: " + kh_totalPowerMin + " - " + kh_totalPowerMax, false);

      if (KHdatas[khname].burst_name){
        var burstdesc = KHdatas[khname].burst_desc;
        embed.addField(":b: "+KHdatas[khname].burst_name,burstdesc,false)
      }
      if (KHdatas[khname].ability1_name){
        var abilitycool1  = KHdatas[khname].ability1_cd;
        var abilitydur1   = KHdatas[khname].ability1_dur;
        if (abilitycool1.length)
            abilitycool1 = ':battery: '+abilitycool1;
        if (abilitydur1.length)
            abilitydur1  = ':hourglass: '+abilitydur1;
        embed.addField(":regional_indicator_a: "+KHdatas[khname].ability1_name+" "+abilitydur1+abilitycool1,KHdatas[khname].ability1_desc,false)
      }
      if (KHdatas[khname].ability2_name){
        var abilitycool2  = KHdatas[khname].ability2_cd;
        var abilitydur2   = KHdatas[khname].ability2_dur;
        if (abilitycool2.length)
            abilitycool2 = ':battery: '+abilitycool2;
        if (abilitydur2.length)
            abilitydur2  = ':hourglass: '+abilitydur2;
        embed.addField(":regional_indicator_a: "+KHdatas[khname].ability2_name+" "+abilitydur2+abilitycool2,KHdatas[khname].ability2_desc,false)
      }
      if (KHdatas[khname].ability3_name){
        var abilitycool3  = KHdatas[khname].ability3_cd;
        var abilitydur3   = KHdatas[khname].ability3_dur;
        if (abilitycool3.length)
            abilitycool3 = ':battery: '+abilitycool3;
        if (abilitydur3.length)
            abilitydur3  = ':hourglass: '+abilitydur3;
        embed.addField(":regional_indicator_a: "+KHdatas[khname].ability3_name+" "+abilitydur3+abilitycool3,KHdatas[khname].ability3_desc,false)
      }

      if (KHdatas[khname].assist_name){
        embed.addField(":white_check_mark: "+KHdatas[khname].assist_name,KHdatas[khname].assist_desc,false)
      }

      embed.addField("Obtained from:",KHdatas[khname].obtained,false);
      if (KHdatas[khname].release_weapon) {
        if (KHdatas[khname].release_weapon_link) {
          embed.addField("Released weapon:","["+KHdatas[khname].release_weapon+"]("+config.wikidomain+KHdatas[khname].release_weapon_link+")",false);
        }
        else {
          embed.addField("Released weapon:",KHdatas[khname].release_weapon,false);
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
      var ed_thumb                    = config.thumbrooturl+EDdatas[khname].portraiturl;
      var ed_image                    = config.thumbrooturl+EDdatas[khname].imageurl;
      var ed_rarity                   = EDdatas[khname].rarity;
      var ed_element                  = EDdatas[khname].element+"Symbol";
      var ed_attackMin                = EDdatas[khname].atk_min;
      var ed_attackMax                = EDdatas[khname].atk_max;
      var ed_HPMin                    = EDdatas[khname].hp_min;
      var ed_HPMax                    = EDdatas[khname].hp_max;
      var ed_totalPowerMin            = parseInt(ed_attackMin)+parseInt(ed_HPMin);
      var ed_totalPowerMax            = parseInt(ed_attackMax)+parseInt(ed_HPMax);
      var ed_summonAttack             = ":a: Summon Attack - "+EDdatas[khname].summon_atk;
      var ed_summonAttackEffect       = EDdatas[khname].summon_atk_des;
      var ed_summonAttackCooldown     = EDdatas[khname].summon_cd +" turns";
      var ed_eidolonsEffect           = ":regional_indicator_e: Eidolon Effect - "+EDdatas[khname].eidolon_effect;
      var ed_eidolonEffectTier0Stars  = "\u2606 \u2606 \u2606 \u2606";
      var ed_eidolonEffectTier0Effect = EDdatas[khname].eidolon_effect_des_0;
      var ed_eidolonEffectTier1Stars  = "\u2605 \u2606 \u2606 \u2606";
      var ed_eidolonEffectTier1Effect = EDdatas[khname].eidolon_effect_des_1;
      var ed_eidolonEffectTier2Stars  = "\u2605 \u2605 \u2606 \u2606";
      var ed_eidolonEffectTier2Effect = EDdatas[khname].eidolon_effect_des_2;
      var ed_eidolonEffectTier3Stars  = "\u2605 \u2605 \u2605 \u2606";
      var ed_eidolonEffectTier3Effect = EDdatas[khname].eidolon_effect_des_3;
      var ed_eidolonEffectTier4Stars  = "\u2605 \u2605 \u2605 \u2605";
      var ed_eidolonEffectTier4Effect = EDdatas[khname].eidolon_effect_des_4;


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

    // --- Weapons

    if(WPdatas.hasOwnProperty(khname))
    {
        var wp_name           = WPdatas[khname].name;
        var ed_link           = config.wikidomain+WPdatas[khname].link;
        var wp_rarity         = WPdatas[khname].rarity;
        var wp_element        = WPdatas[khname].element+"Symbol";
        var wp_portraiturl    = config.thumbrooturl+WPdatas[khname].portraiturl;
        var wp_imageurl       = config.thumbrooturl+WPdatas[khname].imageurl;
        var wp_attackMin      = WPdatas[khname].atk_min;
        var wp_attackMax      = WPdatas[khname].atk_max;
        var wp_HPMin          = WPdatas[khname].hp_min;
        var wp_HPMax          = WPdatas[khname].hp_max;
        var wp_totalPowerMin  = parseInt(wp_HPMin)+parseInt(wp_attackMin);
        var wp_totalPowerMax  = parseInt(wp_HPMax)+parseInt(wp_attackMax);

        const embed = new Discord.RichEmbed()
          .setTitle(config.eimojis[wp_rarity]+" "+config.eimojis[wp_element]+" ("+WPdatas[khname].type+")")
          .setAuthor("Weapon: "+wp_name, "")
          .setColor("#00AE86")
          .setThumbnail(wp_portraiturl)
          .addField("Statistics:", ":crossed_swords: " + wp_attackMin + " - " + wp_attackMax + "    :green_heart: " + wp_HPMin + " - " + wp_HPMax + "    :muscle: " + wp_totalPowerMin + " - " + wp_totalPowerMax, false);

        if (ed_link){
          embed.setURL(ed_link);
        }

        if (WPdatas[khname].obtained) {
          embed.addField("Obtained from:",WPdatas[khname].obtained,false);
        }
        if (WPdatas[khname].burst_fulldesc) {
          embed.addField(":b: Burst Effect:",WPdatas[khname].burst_fulldesc,false);
        }
        if (WPdatas[khname].skill_name) {
          embed.addField(":regional_indicator_s: "+WPdatas[khname].skill_name+":",WPdatas[khname].skill_desc,false);
        }
        if (WPdatas[khname].releases) {
          if (WPdatas[khname].releases_link) {
            embed.addField("Releases:","["+WPdatas[khname].releases+"]("+config.wikidomain+WPdatas[khname].releases_link+")",false);
          }
          else {
            embed.addField("Releases:",WPdatas[khname].releases,false);
          }
        }

        if (wp_imageurl){
          embed.setImage(wp_imageurl);
        }
        if (WPdatas[khname].description) {
          embed.setDescription("*"+WPdatas[khname].description+"*")
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
