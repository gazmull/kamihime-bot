const discord = require('discord.js');

exports.run = (message, config, khItems, khIdx) => {
  const wp_name           = khItems[khIdx].name;
  const ed_link           = config.wikidomain+khItems[khIdx].link;
  const wp_rarity         = khItems[khIdx].rarity;
  const wp_element        = khItems[khIdx].element+'Symbol';
  const wp_portraiturl    = config.thumbrooturl+khItems[khIdx].portraiturl;
  const wp_imageurl       = config.thumbrooturl+khItems[khIdx].imageurl;
  const wp_attackMin      = khItems[khIdx].atk_min;
  const wp_attackMax      = khItems[khIdx].atk_max;
  const wp_HPMin          = khItems[khIdx].hp_min;
  const wp_HPMax          = khItems[khIdx].hp_max;
  const wp_totalPowerMin  = parseInt(wp_HPMin)+parseInt(wp_attackMin);
  const wp_totalPowerMax  = parseInt(wp_HPMax)+parseInt(wp_attackMax);

  const embed = new discord.RichEmbed()
    .setTitle(config.eimojis[wp_rarity]+' '+config.eimojis[wp_element]+' ('+khItems[khIdx].type+')')
    .setAuthor('Weapon: '+wp_name, '')
    .setColor('#00AE86')
    .setThumbnail(wp_portraiturl)
    .addField('Statistics:', ':crossed_swords: ATK: ' + wp_attackMin + '-' + wp_attackMax + ' :green_heart: HP: ' + wp_HPMin + '-' + wp_HPMax + ' :muscle: PWR: ' + wp_totalPowerMin + '-' + wp_totalPowerMax, false);

  if (ed_link){
    embed.setURL(ed_link);
  }

  if (khItems[khIdx].obtained)
    embed.addField('Obtained from:',khItems[khIdx].obtained,false);

  if (khItems[khIdx].burst_fulldesc)
    embed.addField(':b: Burst Effect:',khItems[khIdx].burst_fulldesc,false);

  if (khItems[khIdx].skill_name)
    embed.addField(':regional_indicator_s: '+khItems[khIdx].skill_name+':',khItems[khIdx].skill_desc,false);

  if (khItems[khIdx].skill_name2)
    embed.addField(':regional_indicator_s: '+khItems[khIdx].skill_name2+':',khItems[khIdx].skill_desc2,false);

  if (khItems[khIdx].releases) {
    if (khItems[khIdx].releases_link) {
      embed.addField('Releases:','['+khItems[khIdx].releases+']('+config.wikidomain+khItems[khIdx].releases_link+')',false);
    }
    else {
      embed.addField('Releases:',khItems[khIdx].releases,false);
    }
  }

  //if(! khItems[khIdx].skill_type)
  //  embed.addField('This page is incomplete: ','[Help us by contributing to wikia]('+ed_link+')',false);

  if (wp_imageurl)
    embed.setImage(wp_imageurl);

  if (khItems[khIdx].description)
    embed.setDescription('*'+khItems[khIdx].description+'*')

  return embed;
}
