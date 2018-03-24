const KHInfo = require('../base/KHInfo');
const { RichEmbed } = require('discord.js');

class KamihimeInfo extends KHInfo {
  get releaseWeaponlink() {
    return `${this.config.wikidomain}/w/${encodeURI(this.res.release_weapon)}`;
  }

  format() {
    const { config: { eimojis: badge } } = this;
    const hime = this.template();
    const embed = new RichEmbed()
      .setTitle(`${badge[hime.rarity]} ${badge[`${hime.element}Symbol`]} (${hime.type})`)
      .setDescription(`*${hime.description}*`);

    if (hime.favouriteWeapon)
      embed.addField(':regional_indicator_f: Favourite Weapon', hime.favouriteWeapon);

    if (hime.releaseWeapon)
      embed.addField(
        'Release Weapon',
        `[${hime.releaseWeapon}](${hime.releaseWeaponLink})`
      );

    return super.format(embed, hime);
  }

  template() {
    const { res, link, releaseWeaponLink, image, thumbnail } = this;
    const hpMin = parseInt(res.hp_min);
    const hpMax = parseInt(res.hp_max);
    const atkMin = parseInt(res.atk_min);
    const atkMax = parseInt(res.atk_max);

    return {
      name: res.name,
      description: res.description,
      releaseWeapon: res.release_weapon,
      favouriteWeapon: res.favourite_weapon,
      link,
      releaseWeaponLink,
      image,
      thumbnail,
      rarity: res.rarity,
      element: res.element,
      type: res.type,
      hpMin,
      hpMax,
      atkMin,
      atkMax,
      ttlMin: hpMin + atkMin,
      ttlMax: hpMax + atkMax,

      burst: {
        name: res.burst_name,
        description: res.burst_description
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
        res.assist_name
          ? {
            name: res.assist_name,
            description: res.assist_desc
          }
          : null
      ],

      obtainedFrom: res.obtained
    };
  }
}

module.exports = KamihimeInfo;
