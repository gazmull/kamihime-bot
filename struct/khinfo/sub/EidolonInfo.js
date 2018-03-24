const KHInfo = require('../base/KHInfo');
const { RichEmbed } = require('discord.js');

class EidolonInfo extends KHInfo {
  format() {
    const { config: { eimojis: badge } } = this;
    const eidolon = this.template();
    const embed = new RichEmbed()
      .setTitle(`${badge[eidolon.rarity]} ${badge[`${eidolon.element}Symbol`]} (Wiki Page)`)
      .setDescription(`*${eidolon.description}*`);

    if (eidolon.summon.name)
      embed.addField([
        `:a: ${eidolon.summon.name} `,
        `:hourglass: ${eidolon.summon.cooldown} turns `,
        eidolon.summon.duration ? `:battery: ${eidolon.summon.duration}` : ''
      ],
      eidolon.summon.description
      );

    if (eidolon.effect.name)
      embed.addField(
        `:regional_indicator_e: ${eidolon.effect.name}`,
        this.parseStars(eidolon.effect.description).join('\n')
      );

    return super.format(embed, eidolon);
  }

  parseStars(desc) {
    const result = [];

    for (let i = 0; i < desc.length; i++) {
      if (i === 0) {
        result.push(`${'☆ '.repeat(4)}${desc[i]}`);
        continue;
      }
      result.push(
        `${'★ '.repeat(i)}${
          '☆ '.repeat(
            i === 1
              ? 3
              : i === 2
                ? 2
                : i === 3
                  ? 1
                  : 0
          )}${desc[i]}`
      );
    }

    return result;
  }

  template() {
    const { res, link, image, thumbnail } = this;
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
      rarity: res.rarity,
      element: res.element,
      hpMin,
      hpMax,
      atkMin,
      atkMax,
      ttlMin: hpMin + atkMin,
      ttlMax: hpMax + atkMax,

      summon: {
        name: res.summon_atk,
        description: res.summon_atk_des,
        cooldown: res.summon_cd,
        duration: res.summon_effect_dur
      },

      effect: {
        name: res.eidolon_effect,
        description: [
          res.eidolon_effect_des_0,
          res.eidolon_effect_des_1,
          res.eidolon_effect_des_2,
          res.eidolon_effect_des_3,
          res.eidolon_effect_des_4
        ]
      },

      obtainedFrom: res.obtained
    };
  }
}

module.exports = EidolonInfo;
