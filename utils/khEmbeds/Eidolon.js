const discord = require('discord.js');

exports.run = (message, config, khItems, khIdx) => {
  const ed_name                     = khItems[khIdx].name;
  const ed_link                     = config.wikidomain+khItems[khIdx].link;
  const ed_thumb                    = config.thumbrooturl+khItems[khIdx].portraiturl;
  const ed_image                    = config.thumbrooturl+khItems[khIdx].imageurl;
  const ed_rarity                   = khItems[khIdx].rarity;
  const ed_element                  = khItems[khIdx].element+'Symbol';
  const ed_attackMin                = khItems[khIdx].atk_min;
  const ed_attackMax                = khItems[khIdx].atk_max;
  const ed_HPMin                    = khItems[khIdx].hp_min;
  const ed_HPMax                    = khItems[khIdx].hp_max;
  const ed_totalPowerMin            = parseInt(ed_attackMin)+parseInt(ed_HPMin);
  const ed_totalPowerMax            = parseInt(ed_attackMax)+parseInt(ed_HPMax);
  const ed_summonAttack             = ':a: '+khItems[khIdx].summon_atk;
  const ed_summonAttackEffect       = khItems[khIdx].summon_atk_des;
  const ed_summonAttackCooldown     = ':hourglass: '+khItems[khIdx].summon_cd +' turns';
  const ed_eidolonsEffect           = ':regional_indicator_e: '+khItems[khIdx].eidolon_effect;
  const ed_eidolonEffectTier0Stars  = '\u2606 \u2606 \u2606 \u2606';
  const ed_eidolonEffectTier0Effect = khItems[khIdx].eidolon_effect_des_0;
  const ed_eidolonEffectTier1Stars  = '\u2605 \u2606 \u2606 \u2606';
  const ed_eidolonEffectTier1Effect = khItems[khIdx].eidolon_effect_des_1;
  const ed_eidolonEffectTier2Stars  = '\u2605 \u2605 \u2606 \u2606';
  const ed_eidolonEffectTier2Effect = khItems[khIdx].eidolon_effect_des_2;
  const ed_eidolonEffectTier3Stars  = '\u2605 \u2605 \u2605 \u2606';
  const ed_eidolonEffectTier3Effect = khItems[khIdx].eidolon_effect_des_3;
  const ed_eidolonEffectTier4Stars  = '\u2605 \u2605 \u2605 \u2605';
  const ed_eidolonEffectTier4Effect = khItems[khIdx].eidolon_effect_des_4;
  let ed_summonEffectDur            = khItems[khIdx].summon_effect_dur;

  if (ed_summonEffectDur)
    ed_summonEffectDur = ' :battery: '+ed_summonEffectDur;

  const embed = new discord.RichEmbed()
  .setTitle(config.eimojis[ed_rarity]+' '+config.eimojis[ed_element]+' (Wiki page)')
  .setAuthor('Eidolon: '+ed_name, '')
  .setColor('#00AE86')
  .setDescription('*'+khItems[khIdx].description+'*')
  .setThumbnail(ed_thumb)
  .setURL(ed_link)
  .addField('Statistics:', ':crossed_swords: ATK: ' + ed_attackMin + '-' + ed_attackMax + ' :green_heart: HP: ' + ed_HPMin + '-' + ed_HPMax + ' :muscle: PWR: ' + ed_totalPowerMin + '-' + ed_totalPowerMax, false);

  if (ed_summonAttack.length && ed_summonAttackEffect.length)
    embed.addField(ed_summonAttack + ed_summonAttackCooldown + ed_summonEffectDur, ed_summonAttackEffect,false);

  if (ed_eidolonsEffect.length && khItems[khIdx].link)
    embed.addField(
      ed_eidolonsEffect,
      ed_eidolonEffectTier0Stars+' '+ed_eidolonEffectTier0Effect+'\n'+
      ed_eidolonEffectTier1Stars+' '+ed_eidolonEffectTier1Effect+'\n'+
      ed_eidolonEffectTier2Stars+' '+ed_eidolonEffectTier2Effect+'\n'+
      ed_eidolonEffectTier3Stars+' '+ed_eidolonEffectTier3Effect+'\n'+
      ed_eidolonEffectTier4Stars+' '+ed_eidolonEffectTier4Effect+'\n',
      false
    );

  if (khItems[khIdx].obtained)
    embed.addField('Obtained from:',khItems[khIdx].obtained,false);

  if (ed_image)
    embed.setImage(ed_image);

  return embed;
}
