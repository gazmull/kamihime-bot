const discord = require('discord.js');

exports.run = (message, config, khItems, khIdx) => {
  const sl_name           = khItems[khIdx].name;
  const sl_link           = config.wikidomain+khItems[khIdx].link;
  const sl_thumb          = config.thumbrooturl+khItems[khIdx].portraiturl;
  const sl_image          = config.thumbrooturl+khItems[khIdx].imageurl;
  const sl_rarity         = khItems[khIdx].tier;
  const sl_class          = khItems[khIdx].type;
  const sl_subType        = khItems[khIdx].sub_type;
  const sl_weapons1       = khItems[khIdx].weapon1;
  const sl_weapons2       = khItems[khIdx].weapon2;

  const sl_releaseCond    = khItems[khIdx].soul1+' Lvl 20 & '+khItems[khIdx].soul2+' Lvl 20 & '+khItems[khIdx].soul_p;
  let sl_description    = '*'+khItems[khIdx].description+'*';

  sl_description        += '\n\n__**Favourite Weapons:**__  '+sl_weapons1+' - '+sl_weapons2;
  sl_description        += '\n__**Master Bonus:**__  '+khItems[khIdx].master_bonus;
  sl_description        += '\n__**Release Conditions:**__  '+sl_releaseCond;
  //sl_description        += '\n__**Bonus At Maximum Level:**__  '+' TODO';

  const embed = new discord.RichEmbed()
  .setTitle(sl_rarity+' - '+sl_subType+' ('+sl_class+')')
  .setAuthor('Soul: '+sl_name, '')
  .setColor('#00AE86');

  if (sl_description)
    embed.setDescription(sl_description);

  if (sl_thumb)
    embed.setThumbnail(sl_thumb);

  if (sl_link)
    embed.setURL(sl_link);

  if (sl_image)
    embed.setImage(sl_image);


  if (khItems[khIdx].burst_name) {
    const burstdesc = khItems[khIdx].burst_desc;

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

    let abilityunlock2  = ' :unlock: Lvl ';
    if (sl_rarity=='standard')
      abilityunlock2+=' 10'; else abilityunlock2+=' 5';
    const abilitydesc2    = khItems[khIdx].ability2_desc;

    embed.addField(':regional_indicator_a: '+khItems[khIdx].ability2_name+' '+abilitydur2+abilitycool2+abilityunlock2,khItems[khIdx].ability2_desc,false)

  }

  if (khItems[khIdx].ability3_name) {


      let abilitycool3  = khItems[khIdx].ability3_cd;
      let abilitydur3   = khItems[khIdx].ability3_dur;
      if (abilitycool3.length)
          abilitycool3 = ':battery: '+abilitycool3;
      if (abilitydur3.length)
          abilitydur3  = ':hourglass: '+abilitydur3;

      const abilityunlock3  = ' :unlock: Lvl 15';
      
      embed.addField(':regional_indicator_a: '+khItems[khIdx].ability3_name+' '+abilitydur3+abilitycool3+abilityunlock3,khItems[khIdx].ability3_desc,false)

  }

  if (khItems[khIdx].assist1_name)
    embed.addField(':white_check_mark: '+khItems[khIdx].assist1_name,khItems[khIdx].assist1_desc,false)

  if (khItems[khIdx].assist2_name)
    embed.addField(':white_check_mark: '+khItems[khIdx].assist2_name,khItems[khIdx].assist2_desc,false)

  message.channel.send({embed});
}
