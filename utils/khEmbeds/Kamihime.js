const discord = require('discord.js');

exports.run = (message, config, khItems, khIdx) => {
  const kh_name           = khItems[khIdx].name;
  const kh_link           = config.wikidomain+khItems[khIdx].link;
  const kh_thumb          = config.thumbrooturl+khItems[khIdx].portraiturl;
  const kh_image          = config.thumbrooturl+khItems[khIdx].imageurl;
  const kh_rarity         = khItems[khIdx].rarity;
  const kh_element        = khItems[khIdx].element;
  const kh_type           = khItems[khIdx].type;
  const kh_attackMin      = khItems[khIdx].atk_min;
  const kh_attackMax      = khItems[khIdx].atk_max;
  const kh_HPMin          = khItems[khIdx].hp_min;
  const kh_HPMax          = khItems[khIdx].hp_max;
  const kh_totalPowerMin  = parseInt(kh_HPMin)+parseInt(kh_attackMin);
  const kh_totalPowerMax  = parseInt(kh_HPMax)+parseInt(kh_attackMax);

  const embed = new discord.RichEmbed()
  .setTitle(config.eimojis[kh_rarity]+' '+config.eimojis[kh_element+'Symbol']+' ('+kh_type+')')
  .setAuthor('Kamihime: '+kh_name, '')
  .setColor('#00AE86')
  .setDescription('*'+khItems[khIdx].description+'*')
  .setThumbnail(kh_thumb)
  .setURL(kh_link)
  .setImage(kh_image)
  .addField('Statistics:', ':crossed_swords: ATK: ' + kh_attackMin + '-' + kh_attackMax + ' :green_heart: HP: ' + kh_HPMin + '-' + kh_HPMax + ' :muscle: PWR: ' + kh_totalPowerMin + '-' + kh_totalPowerMax, false);

  if (khItems[khIdx].favourite_weapon) {
    embed.addField(':regional_indicator_f: Favourite weapon:',khItems[khIdx].favourite_weapon,false);
  }

  if (khItems[khIdx].burst_name) {
    const burstdesc = khItems[khIdx].burst_description;
    embed.addField(':b: '+khItems[khIdx].burst_name,burstdesc,false)
  }

  if (khItems[khIdx].ability1_name) {
    let abilitycool1  = khItems[khIdx].ability1_cd;
    let abilitydur1   = khItems[khIdx].ability1_dur;
    if (abilitycool1.length)
        abilitycool1 = ':battery: '+abilitycool1;
    if (abilitydur1.length)
        abilitydur1  = ':hourglass: '+abilitydur1;
    embed.addField(':regional_indicator_a: '+khItems[khIdx].ability1_name+' '+abilitydur1+abilitycool1,khItems[khIdx].ability1_desc,false)
  }

  if (khItems[khIdx].ability2_name) {
    let abilitycool2  = khItems[khIdx].ability2_cd;
    let abilitydur2   = khItems[khIdx].ability2_dur;
    if (abilitycool2.length)
        abilitycool2 = ':battery: '+abilitycool2;
    if (abilitydur2.length)
        abilitydur2  = ':hourglass: '+abilitydur2;
    embed.addField(':regional_indicator_a: '+khItems[khIdx].ability2_name+' '+abilitydur2+abilitycool2,khItems[khIdx].ability2_desc,false)
  }

  if (khItems[khIdx].ability3_name) {
    let abilitycool3  = khItems[khIdx].ability3_cd;
    let abilitydur3   = khItems[khIdx].ability3_dur;
    if (abilitycool3.length)
        abilitycool3 = ':battery: '+abilitycool3;
    if (abilitydur3.length)
        abilitydur3  = ':hourglass: '+abilitydur3;
    embed.addField(':regional_indicator_a: '+khItems[khIdx].ability3_name+' '+abilitydur3+abilitycool3,khItems[khIdx].ability3_desc,false)
  }

  if (khItems[khIdx].assist_name)
    embed.addField(':white_check_mark: '+khItems[khIdx].assist_name,khItems[khIdx].assist_desc, false)

  embed.addField('Obtained from:',khItems[khIdx].obtained,false);

  if (khItems[khIdx].release_weapon) {
    if (khItems[khIdx].release_weapon_link) {
      embed.addField('Released weapon:','['+khItems[khIdx].release_weapon+']('+config.wikidomain+khItems[khIdx].release_weapon_link+')',false);
    }
    else {
      embed.addField('Released weapon:',khItems[khIdx].release_weapon,false);
    }
  }

  return embed;
}
