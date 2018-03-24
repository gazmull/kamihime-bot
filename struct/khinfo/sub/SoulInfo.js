const KHInfo = require('../base/KHInfo');
const { RichEmbed } = require('discord.js');

class SoulInfo extends KHInfo {
  format() {
    const soul = this.template();
    const embed = new RichEmbed()
      .setTitle(`${soul.tier} - ${soul.subType} (${soul.type})`)
      .setDescription([
        `*${soul.description}*`,
        `\n__**Favourite Weapons:**__ ${soul.favouriteWeapons[0]}${
          soul.favouriteWeapons[1] && soul.favouriteWeapons[1] !== 'N/A'
            ? ` - ${soul.favouriteWeapons[1]}`
            : ''}`,
        `__**Master Bonus:**__ ${soul.masterBonus}`,
        `__**Release Conditions:**__ ${soul.souls[0] ? `${soul.souls[0]} Lvl 20 & ` : ''}${
          soul.souls[1]
            ? `${soul.souls[1]} Lvl 20 & `
            : ''}${soul.soulPoints}`
      ]);

    return super.format(embed, soul);
  }

  template() {
    const { res, link, image, thumbnail } = this;

    return {
      name: res.name,
      description: res.description,
      link,
      image,
      thumbnail,
      tier: res.tier,
      type: res.type,
      subType: res.sub_type,
      masterBonus: res.master_bonus,
      soulPoints: res.soul_p,
      favouriteWeapons: [
        res.weapon1,
        res.weapon2
      ],
      souls: res.soul1 || res.soul2
        ? [
          res.soul1,
          res.soul2
        ]
        : [],

      burst: {
        name: res.burst_name,
        description: res.burst_desc
      },

      abilities: [
        res.ability1_name
          ? {
            name: res.ability1_name,
            description: res.ability1_desc,
            cooldown: res.ability1_cd,
            duration: res.ability1_dur
          }
          : null,

        res.ability2_name
          ? {
            name: res.ability2_name,
            description: res.ability2_desc,
            cooldown: res.ability2_cd,
            duration: res.ability2_dur
          }
          : null,

        res.ability3_name
          ? {
            name: res.ability3_name,
            description: res.ability3_desc,
            cooldown: res.ability3_cd,
            duration: res.ability3_dur
          }
          : null
      ],

      assistAbilities: [
        res.assist1_name
          ? {
            name: res.assist1_name,
            description: res.assist1_desc
          }
          : null,

        res.assist2_name
          ? {
            name: res.assist2_name,
            description: res.assist2_desc
          }
          : null
      ]
    };
  }
}

module.exports = SoulInfo;
