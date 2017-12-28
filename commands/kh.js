// Return Simple Item datasheets.
// Currently supported items: Kamihimes Eidolons Souls & Weapons

const discord   = require("discord.js");
const config    = require("../config.json");
const khinfos   = require("../khinfos.js");
const fuzzy     = require('fuzzy');
const khArray  = khinfos.getKHInfos();

var fuzzyOptions = {
  extract: function(el) { return el.name; }
};

// --- process the command

exports.run     = (client, message, args) => {
  var khfound   = false;
  var khrequest = args.join(" ");

  if (khrequest.length < 2)
  {
    message.channel.send("For a search query to be effective, you must enter at least two characters.");
    return;
  }

  var results = fuzzy.filter(khrequest, khArray, fuzzyOptions);
  var khItems = results.map(function(el) { return el.original; });

  // --- Main Loop for Kamihimes, Eidolons, Souls & Weapons

  for (khIdx = 0; khIdx < khItems.length; khIdx++)
  {

    // Limit the bot to only one response
    if ( khIdx > 0) {
      //message.channel.send("```There's too much results. Please try to narrow your search```");
      return;
    }

    // --- Kamihimes

    if(khItems[khIdx].objectType == "Kamihime")
    {
      var kh_name           = khItems[khIdx].name;
      var kh_link           = config.wikidomain+khItems[khIdx].link;
      var kh_thumb          = config.thumbrooturl+khItems[khIdx].portraiturl;
      var kh_image          = config.thumbrooturl+khItems[khIdx].imageurl;
      var kh_rarity         = khItems[khIdx].rarity;
      var kh_element        = khItems[khIdx].element;
      var kh_type          = khItems[khIdx].type;
      var kh_attackMin      = khItems[khIdx].atk_min;
      var kh_attackMax      = khItems[khIdx].atk_max;
      var kh_HPMin          = khItems[khIdx].hp_min;
      var kh_HPMax          = khItems[khIdx].hp_max;
      var kh_totalPowerMin  = parseInt(kh_HPMin)+parseInt(kh_attackMin);
      var kh_totalPowerMax  = parseInt(kh_HPMax)+parseInt(kh_attackMax);

      const embed = new discord.RichEmbed()
      .setTitle(config.eimojis[kh_rarity]+" "+config.eimojis[kh_element+"Symbol"]+" ("+kh_type+")")
      .setAuthor("Kamihime: "+kh_name, "")
      .setColor("#00AE86")
      .setDescription("*"+khItems[khIdx].description+"*")
      .setThumbnail(kh_thumb)
      .setURL(kh_link)
      .setImage(kh_image)
      .addField("Statistics:", ":crossed_swords: ATK: " + kh_attackMin + "-" + kh_attackMax + " :green_heart: HP: " + kh_HPMin + "-" + kh_HPMax + " :muscle: PWR: " + kh_totalPowerMin + "-" + kh_totalPowerMax, false);

      if (khItems[khIdx].burst_name){
        var burstdesc = khItems[khIdx].burst_description;
        embed.addField(":b: "+khItems[khIdx].burst_name,burstdesc,false)
      }
      if (khItems[khIdx].ability1_name){
        var abilitycool1  = khItems[khIdx].ability1_cd;
        var abilitydur1   = khItems[khIdx].ability1_dur;
        if (abilitycool1.length)
            abilitycool1 = ':battery: '+abilitycool1;
        if (abilitydur1.length)
            abilitydur1  = ':hourglass: '+abilitydur1;
        embed.addField(":regional_indicator_a: "+khItems[khIdx].ability1_name+" "+abilitydur1+abilitycool1,khItems[khIdx].ability1_desc,false)
      }
      if (khItems[khIdx].ability2_name){
        var abilitycool2  = khItems[khIdx].ability2_cd;
        var abilitydur2   = khItems[khIdx].ability2_dur;
        if (abilitycool2.length)
            abilitycool2 = ':battery: '+abilitycool2;
        if (abilitydur2.length)
            abilitydur2  = ':hourglass: '+abilitydur2;
        embed.addField(":regional_indicator_a: "+khItems[khIdx].ability2_name+" "+abilitydur2+abilitycool2,khItems[khIdx].ability2_desc,false)
      }
      if (khItems[khIdx].ability3_name){
        var abilitycool3  = khItems[khIdx].ability3_cd;
        var abilitydur3   = khItems[khIdx].ability3_dur;
        if (abilitycool3.length)
            abilitycool3 = ':battery: '+abilitycool3;
        if (abilitydur3.length)
            abilitydur3  = ':hourglass: '+abilitydur3;
        embed.addField(":regional_indicator_a: "+khItems[khIdx].ability3_name+" "+abilitydur3+abilitycool3,khItems[khIdx].ability3_desc,false)
      }

      if (khItems[khIdx].assist_name){
        embed.addField(":white_check_mark: "+khItems[khIdx].assist_name,khItems[khIdx].assist_desc,false)
      }

      embed.addField("Obtained from:",khItems[khIdx].obtained,false);
      if (khItems[khIdx].release_weapon) {
        if (khItems[khIdx].release_weapon_link) {
          embed.addField("Released weapon:","["+khItems[khIdx].release_weapon+"]("+config.wikidomain+khItems[khIdx].release_weapon_link+")",false);
        }
        else {
          embed.addField("Released weapon:",khItems[khIdx].release_weapon,false);
        }
      }

      message.channel.send({embed});
      khfound = true;
    }

    // --- eidolons

    if(khItems[khIdx].objectType == "Eidolon")
    {
      var ed_name                     = khItems[khIdx].name;
      var ed_link                     = config.wikidomain+khItems[khIdx].link;
      var ed_thumb                    = config.thumbrooturl+khItems[khIdx].portraiturl;
      var ed_image                    = config.thumbrooturl+khItems[khIdx].imageurl;
      var ed_rarity                   = khItems[khIdx].rarity;
      var ed_element                  = khItems[khIdx].element+"Symbol";
      var ed_attackMin                = khItems[khIdx].atk_min;
      var ed_attackMax                = khItems[khIdx].atk_max;
      var ed_HPMin                    = khItems[khIdx].hp_min;
      var ed_HPMax                    = khItems[khIdx].hp_max;
      var ed_totalPowerMin            = parseInt(ed_attackMin)+parseInt(ed_HPMin);
      var ed_totalPowerMax            = parseInt(ed_attackMax)+parseInt(ed_HPMax);
      var ed_summonAttack             = ":a: Summon Attack - "+khItems[khIdx].summon_atk;
      var ed_summonAttackEffect       = khItems[khIdx].summon_atk_des;
      var ed_summonAttackCooldown     = khItems[khIdx].summon_cd +" turns";
      var ed_eidolonsEffect           = ":regional_indicator_e: Eidolon Effect - "+khItems[khIdx].eidolon_effect;
      var ed_eidolonEffectTier0Stars  = "\u2606 \u2606 \u2606 \u2606";
      var ed_eidolonEffectTier0Effect = khItems[khIdx].eidolon_effect_des_0;
      var ed_eidolonEffectTier1Stars  = "\u2605 \u2606 \u2606 \u2606";
      var ed_eidolonEffectTier1Effect = khItems[khIdx].eidolon_effect_des_1;
      var ed_eidolonEffectTier2Stars  = "\u2605 \u2605 \u2606 \u2606";
      var ed_eidolonEffectTier2Effect = khItems[khIdx].eidolon_effect_des_2;
      var ed_eidolonEffectTier3Stars  = "\u2605 \u2605 \u2605 \u2606";
      var ed_eidolonEffectTier3Effect = khItems[khIdx].eidolon_effect_des_3;
      var ed_eidolonEffectTier4Stars  = "\u2605 \u2605 \u2605 \u2605";
      var ed_eidolonEffectTier4Effect = khItems[khIdx].eidolon_effect_des_4;


      const embed = new discord.RichEmbed()
      .setTitle(config.eimojis[ed_rarity]+" "+config.eimojis[ed_element])
      .setAuthor("Eidolon: "+ed_name, "")
      .setColor("#00AE86")
        .setThumbnail(ed_thumb)
      .setURL(ed_link)
      .addField("Statistics:", ":crossed_swords: ATK: " + ed_attackMin + "-" + ed_attackMax + " :green_heart: HP: " + ed_HPMin + "-" + ed_HPMax + " :muscle: PWR: " + ed_totalPowerMin + "-" + ed_totalPowerMax, false);

      if (khItems[khIdx].description) {
        embed.setDescription("*"+khItems[khIdx].description+"*")
      }

      if (ed_summonAttack.length && ed_summonAttackEffect.length) {
        embed.addField(ed_summonAttack + " (" + ed_summonAttackCooldown + ")", ed_summonAttackEffect,false);
      }

      if (ed_eidolonsEffect.length && khItems[khIdx].link) {
        embed.addField(ed_eidolonsEffect, ed_eidolonEffectTier0Stars+" "+ed_eidolonEffectTier0Effect+"\n"+
          ed_eidolonEffectTier1Stars+" "+ed_eidolonEffectTier1Effect+"\n"+
          ed_eidolonEffectTier2Stars+" "+ed_eidolonEffectTier2Effect+"\n"+
          ed_eidolonEffectTier3Stars+" "+ed_eidolonEffectTier3Effect+"\n"+
          ed_eidolonEffectTier4Stars+" "+ed_eidolonEffectTier4Effect+"\n"
          ,false);
      }

      if(!khItems[khIdx].link) {
        embed.addField("This page is incomplete: ","[Help us by contributing to wikia]("+ed_link+")",false);
      }

      if (khItems[khIdx].obtained) {
        embed.addField("Obtained from:",khItems[khIdx].obtained,false);
      }
      if (ed_image) {
        embed.setImage(ed_image);
      }

      message.channel.send({embed});
      khfound = true;
    }

    // --- Souls

    if(khItems[khIdx].objectType == "Soul")
    {
      var sl_name           = khItems[khIdx].name;
      var sl_link           = config.wikidomain+khItems[khIdx].link;
      var sl_thumb          = config.thumbrooturl+khItems[khIdx].portraiturl;
      var sl_image          = config.thumbrooturl+khItems[khIdx].imageurl;
      var sl_rarity         = khItems[khIdx].tier;
      var sl_class          = khItems[khIdx].type;
      var sl_subType        = khItems[khIdx].sub_type;
      var sl_weapons1       = khItems[khIdx].weapon1;
      var sl_weapons2       = khItems[khIdx].weapon2;

      var sl_releaseCond    = khItems[khIdx].soul1+" Lvl 20 & "+khItems[khIdx].soul2+" Lvl 20 & "+khItems[khIdx].soul_p;
      var sl_description    = "*"+khItems[khIdx].description+"*";

      sl_description        += "\n\n__**Favourite Weapons:**__  "+sl_weapons1+" - "+sl_weapons2;
      sl_description        += "\n__**Master Bonus:**__  "+khItems[khIdx].master_bonus;
      sl_description        += "\n__**Release Conditions:**__  "+sl_releaseCond;
      //sl_description        += "\n__**Bonus At Maximum Level:**__  "+" TODO";

      const embed = new discord.RichEmbed()
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

      if (khItems[khIdx].burst_name){
        var burstdesc = khItems[khIdx].burst_desc;
        embed.addField(":b: "+khItems[khIdx].burst_name,burstdesc,false)
      }
      if (khItems[khIdx].ability1_name){
        if (khItems[khIdx].ability1_cd) khItems[khIdx].ability1_cd = ' :battery: '+khItems[khIdx].ability1_cd;
        if (khItems[khIdx].ability1_dur) khItems[khIdx].ability1_dur = ' :hourglass: '+khItems[khIdx].ability1_dur;
        var abilitydesc1  = khItems[khIdx].ability1_desc;
        embed.addField(":regional_indicator_a: "+khItems[khIdx].ability1_name+khItems[khIdx].ability1_cd+khItems[khIdx].ability1_dur, abilitydesc1, false)
      }
      if (khItems[khIdx].ability2_name){
        if (khItems[khIdx].ability2_cd) khItems[khIdx].ability2_cd = ' :battery: '+khItems[khIdx].ability2_cd;
        if (khItems[khIdx].ability2_dur) khItems[khIdx].ability2_dur = ' :hourglass: '+khItems[khIdx].ability2_dur;
        var abilityunlock2  = ' :unlock: Lvl ';
        if (sl_rarity=="standard") abilityunlock2+=" 10"; else abilityunlock2+=" 5";
        var abilitydesc2    = khItems[khIdx].ability2_desc;
        embed.addField(":regional_indicator_a: "+khItems[khIdx].ability2_name+khItems[khIdx].ability2_cd+khItems[khIdx].ability2_dur+abilityunlock2, abilitydesc2, false)
      }
      if (khItems[khIdx].ability3_name){
        if (khItems[khIdx].ability3_cd) khItems[khIdx].ability3_cd = ' :battery: '+khItems[khIdx].ability3_cd;
        if (khItems[khIdx].ability3_dur) khItems[khIdx].ability3_dur = ' :hourglass: '+khItems[khIdx].ability3_dur;
        var abilityunlock3  = ' :unlock: Lvl 15';
        var abilitydesc3    = khItems[khIdx].ability3_desc;
        embed.addField(":regional_indicator_a: "+khItems[khIdx].ability3_name+" "+khItems[khIdx].ability3_cd+khItems[khIdx].ability3_dur+abilityunlock3, abilitydesc3, false)
      }

      if (khItems[khIdx].assist1_name){
        embed.addField(":white_check_mark: "+khItems[khIdx].assist1_name,khItems[khIdx].assist1_desc,false)
      }
      if (khItems[khIdx].assist2_name){
        embed.addField(":white_check_mark: "+khItems[khIdx].assist2_name,khItems[khIdx].assist2_desc,false)
      }

      message.channel.send({embed});
      khfound = true;
    }

    // --- Weapons

    if(khItems[khIdx].objectType == "Weapon")
    {
        var wp_name           = khItems[khIdx].name;
        var ed_link           = config.wikidomain+khItems[khIdx].link;
        var wp_rarity         = khItems[khIdx].rarity;
        var wp_element        = khItems[khIdx].element+"Symbol";
        var wp_portraiturl    = config.thumbrooturl+khItems[khIdx].portraiturl;
        var wp_imageurl       = config.thumbrooturl+khItems[khIdx].imageurl;
        var wp_attackMin      = khItems[khIdx].atk_min;
        var wp_attackMax      = khItems[khIdx].atk_max;
        var wp_HPMin          = khItems[khIdx].hp_min;
        var wp_HPMax          = khItems[khIdx].hp_max;
        var wp_totalPowerMin  = parseInt(wp_HPMin)+parseInt(wp_attackMin);
        var wp_totalPowerMax  = parseInt(wp_HPMax)+parseInt(wp_attackMax);

        const embed = new discord.RichEmbed()
          .setTitle(config.eimojis[wp_rarity]+" "+config.eimojis[wp_element]+" ("+khItems[khIdx].type+")")
          .setAuthor("Weapon: "+wp_name, "")
          .setColor("#00AE86")
          .setThumbnail(wp_portraiturl)
          .addField("Statistics:", ":crossed_swords: ATK: " + wp_attackMin + "-" + wp_attackMax + " :green_heart: HP: " + wp_HPMin + "-" + wp_HPMax + " :muscle: PWR: " + wp_totalPowerMin + "-" + wp_totalPowerMax, false);

        if (ed_link){
          embed.setURL(ed_link);
        }

        if (khItems[khIdx].obtained) {
          embed.addField("Obtained from:",khItems[khIdx].obtained,false);
        }
        if (khItems[khIdx].burst_fulldesc) {
          embed.addField(":b: Burst Effect:",khItems[khIdx].burst_fulldesc,false);
        }
        if (khItems[khIdx].skill_name) {
          embed.addField(":regional_indicator_s: "+khItems[khIdx].skill_name+":",khItems[khIdx].skill_desc,false);
        }
        if (khItems[khIdx].skill_name2) {
          embed.addField(":regional_indicator_s: "+khItems[khIdx].skill_name2+":",khItems[khIdx].skill_desc2,false);
        }
        if (khItems[khIdx].releases) {
          if (khItems[khIdx].releases_link) {
            embed.addField("Releases:","["+khItems[khIdx].releases+"]("+config.wikidomain+khItems[khIdx].releases_link+")",false);
          }
          else {
            embed.addField("Releases:",khItems[khIdx].releases,false);
          }
        }

        if(! khItems[khIdx].skill_type) {
          embed.addField("This page is incomplete: ","[Help us by contributing to wikia]("+ed_link+")",false);
        }

        if (wp_imageurl){
          embed.setImage(wp_imageurl);
        }
        if (khItems[khIdx].description) {
          embed.setDescription("*"+khItems[khIdx].description+"*")
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
