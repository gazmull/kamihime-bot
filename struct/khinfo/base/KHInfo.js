class KHInfo {
  constructor(res) {
    this.config = require('../../../config.json'); // eslint-disable-line global-require

    this.res = res;
  }

  get link() {
    return `${this.config.wikidomain}/w/${encodeURI(this.res.name)}`;
  }

  get image() {
    return `${this.config.thumbrooturl}${encodeURI(this.res.imageurl)}`;
  }

  get thumbnail() {
    if (this.res.objectType.toLowerCase() === 'accessory')
      return `${this.config.thumbrooturl}${encodeURI(this.res.thumbnailurl)}`;

    return `${this.config.thumbrooturl}${encodeURI(this.res.portraiturl)}`;
  }

  format(embed, template) {
    const parseSoulAbility = ability => {
      switch (ability) {
        case 1:
          return ` :unlock: Lvl ${template.tier.toLowerCase() === 'standard' ? '10' : '5'}`;
        case 2:
          return ' :unlock: Lvl 15';
        default:
          return '';
      }
    };

    embed
      .setAuthor(`${this.res.objectType}: ${template.name}`, null, template.link)
      .setColor(0x00AE86)
      .setThumbnail(template.thumbnail)
      .setURL(template.link);

    if (template.image)
      embed.setImage(template.image);

    const hasStatistics = template.atkMin && template.atkMax && template.hpMin &&
      template.hpMax && template.ttlMin && template.ttlMax;

    if (hasStatistics) {
      const statField = {
        name: 'Statistics',
        value: [
          `:crossed_swords: ATK: ${template.atkMin} - ${template.atkMax}`,
          `:green_heart: HP: ${template.hpMin} - ${template.hpMax}`,
          `:muscle: PWR: ${template.ttlMin} - ${template.ttlMax}`
        ].join(' ')
      };

      if (embed.fields.length) {
        const oldFields = embed.fields;
        embed.fields = [];

        embed.fields.push(statField);

        for (const field of oldFields)
          embed.fields.push(field);
      } else embed.fields.push(statField);
    }

    if (template.burst)
      embed.addField(`:b: ${template.burst.name}`, template.burst.description);

    if (template.abilities && template.abilities.length)
      for (let i = 0; i < template.abilities.length; i++) {
        const ability = template.abilities[i];

        if (!ability) continue;

        embed.addField([
          `:regional_indicator_a: ${ability.name} `,
          ability.cooldown ? `:battery: ${ability.cooldown} ` : '',
          ability.duration ? ` :hourglass: ${ability.duration} ` : '',
          !template.element && template.tier ? parseSoulAbility(i) : ''
        ],
        ability.description
        );
      }

    if (template.assistAbilities)
      for (let i = 0; i < template.assistAbilities.length; i++) {
        const assistAbility = template.assistAbilities[i];

        if (!assistAbility) continue;

        embed.addField(
          `:white_check_mark: ${assistAbility.name}`,
          assistAbility.description
        );
      }

    if (template.obtainedFrom)
      embed.addField('Obtained From', template.obtainedFrom);

    return embed;
  }
}

module.exports = KHInfo;
