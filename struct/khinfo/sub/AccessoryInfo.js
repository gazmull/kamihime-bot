const KHInfo = require('../base/KHInfo');
const { RichEmbed } = require('discord.js');

class AccessoryInfo extends KHInfo {
  format() {
    const { config: { eimojis: badge } } = this;
    const acce = this.template();
    const embed = new RichEmbed()
      .setTitle(`${badge[acce.rarity]} ${badge[`${acce.element}Symbol`]} (Effects: ${acce.effects})`);

    return super.format(embed, acce);
  }

  template() {
    const { config: { wikidomain: wiki }, res, thumbnail } = this;
    const hpMin = parseInt(res.hp_min);
    const hpMax = parseInt(res.hp_max);
    const atkMin = parseInt(res.atk_min);
    const atkMax = parseInt(res.atk_max);

    return {
      name: res.name,
      rarity: res.rarity,
      link: `${wiki}/w/Accessories`,
      thumbnail,
      element: res.element,
      hpMin,
      hpMax,
      atkMin,
      atkMax,
      ttlMin: hpMin + atkMin,
      ttlMax: hpMax + atkMax,
      effects: res.effects
    };
  }
}

module.exports = AccessoryInfo;
