const discord = require('discord.js');

exports.run = (message, config, khItems, khIdx) => {
  const ac_name           = khItems[khIdx].name;
  const ac_rarity         = khItems[khIdx].rarity;
  const ac_link           = config.wikidomain+'/wiki/Accessories';
  const ac_element        = khItems[khIdx].element+'Symbol';
  const ac_thumbnailurl   = config.thumbrooturl+khItems[khIdx].thumbnailurl;
  const ac_attackMin      = khItems[khIdx].atk_min;
  const ac_attackMax      = khItems[khIdx].atk_max;
  const ac_HPMin          = khItems[khIdx].hp_min;
  const ac_HPMax          = khItems[khIdx].hp_max;
  const ac_totalPowerMin  = parseInt(ac_HPMin)+parseInt(ac_attackMin);
  const ac_totalPowerMax  = parseInt(ac_HPMax)+parseInt(ac_attackMax);
  const ac_effects        = khItems[khIdx].effects;

  const embed = new discord.RichEmbed()
    .setTitle(config.eimojis[ac_rarity]+' '+config.eimojis[ac_element]+' (Effects: '+ac_effects+')')
    .setURL(ac_link)
    .setAuthor('Accessory: '+ac_name, '')
    .setColor('#00AE86')
    .setThumbnail(ac_thumbnailurl)
    .addField('Statistics:', ':crossed_swords: ATK: ' + ac_attackMin + '-' + ac_attackMax + ' :green_heart: HP: ' + ac_HPMin + '-' + ac_HPMax + ' :muscle: PWR: ' + ac_totalPowerMin + '-' + ac_totalPowerMax, false);

    return embed;
}