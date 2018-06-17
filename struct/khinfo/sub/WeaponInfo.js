const KHInfo = require('../base/KHInfo');
const { RichEmbed } = require('discord.js');

class WeaponInfo extends KHInfo {
  get releaseHime() {
    return this.res.releases
      ? `[${this.res.releases}](${`${this.config.wikidomain}/w/${encodeURI(this.res.releases)}`.replace(/(\(|\))/g, '\\$&')})`
      : null;
  }

  format() {
    const { config: { eimojis: badge } } = this;
    const weapon = this.template();
    const embed = new RichEmbed()
      .setTitle(`${badge[weapon.rarity]} ${badge[`${weapon.element}Symbol`]} (${weapon.type})`);

    if (weapon.burstDesc)
      embed.addField(':b: Burst Effect', weapon.burstDesc);

    if (weapon.skills.length)
      for (let i = 0; i < weapon.skills.length; i++) {
        const skill = weapon.skills[i];

        if (!skill) continue;

        embed.addField(`:regional_indicator_s: ${skill.name}`, skill.description);
      }

    if (weapon.releaseHime)
      embed.addField('Releases', weapon.releaseHime);

    return super.format(embed, weapon);
  }

  template() {
    const { res, link, image, thumbnail, releaseHime } = this;
    const hpMin = parseInt(res.hp_min);
    const hpMax = parseInt(res.hp_max);
    const atkMin = parseInt(res.atk_min);
    const atkMax = parseInt(res.atk_max);

    return {
      name: res.name,
      description: res.description,
      link,
      image,
      thumbnail,
      releaseHime,
      rarity: res.rarity,
      element: res.element,
      type: res.type,
      hpMin,
      hpMax,
      atkMin,
      atkMax,
      ttlMin: hpMin + atkMin,
      ttlMax: hpMax + atkMax,

      burstDesc: res.burst_fulldesc,

      skills: [
        res.skill_name
          ? {
            name: res.skill_name,
            description: res.skill_desc
          }
          : null,

        res.skill_name2
          ? {
            name: res.skill_name2,
            description: res.skill_desc2
          }
          : null
      ],

      obtainedFrom: res.obtained
    };
  }
}

module.exports = WeaponInfo;
