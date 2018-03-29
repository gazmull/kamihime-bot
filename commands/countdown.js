const Command = require('../struct/Command');
const moment = require('moment-timezone');

class CountdownCommand extends Command {
  constructor(client) {
    const { config: { prefix } } = client;

    super(client, {
      name: 'countdown',
      description: {
        content: [
          'Displays countdowns related to Kamihime Project in-game events.',
          'It includes special and some regular events.\n',

          '#For-Authorised-Users',
          '[Adding a Countdown]',
          `❯ Usage: ${prefix}countdown add [name] [date]`,
          '❯ Date Format: [YYYY]-[MM]-[DD]T[HH]:[mm]',
          '❯ Note: Date has to be provided in PDT. https://time.is/PDT',
          '[Removing a Countdown]',
          `❯ Usage: ${prefix}countdown remove [name]`,
          '[Testing a Countdown]',
          `❯ Usage: ${prefix}countdown test [date]`,
          '❯ Same date format from adding a countdown.'
        ],
        examples: ['', 'add A User\'s Birthday 2018-04-23T00:00'],
        usage: '[command] [command argument]'
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });

    this.preset = [
      { class: 'DLY', name: 'Daily Reset', time: '00:00', day: '*' },
      { class: 'ENH', name: 'Weapon/Eidolon Enhancement Quest1', time: '12:00', day: '*' },
      { class: 'ENH', name: 'Weapon/Eidolon Enhancement Quest2', time: '19:00', day: '*' },
      { class: 'ENH', name: 'Weapon/Eidolon Enhancement Quest3', time: '22:00', day: '*' },
      { class: 'GEM', name: 'Monday Gem Quest 1', time: '12:00', day: 'Monday' },
      { class: 'GEM', name: 'Monday Gem Quest 2', time: '19:00', day: 'Monday' },
      { class: 'GEM', name: 'Tuesday Gem Quest 1', time: '12:30', day: 'Tuesday' },
      { class: 'GEM', name: 'Tuesday Gem Quest 2', time: '19:30', day: 'Tuesday' },
      { class: 'GEM', name: 'Wednesday Gem Quest 1', time: '18:00', day: 'Wednesday' },
      { class: 'GEM', name: 'Wednesday Gem Quest 2', time: '22:30', day: 'Wednesday' },
      { class: 'GEM', name: 'Thursday Gem Quest 1', time: '19:00', day: 'Thursday' },
      { class: 'GEM', name: 'Thursday Gem Quest 2', time: '23:00', day: 'Thursday' },
      { class: 'GEM', name: 'Friday Gem Quest 1', time: '19:30', day: 'Friday' },
      { class: 'GEM', name: 'Friday Gem Quest 2', time: '23:30', day: 'Friday' },
      { class: 'GEM', name: 'Saturday Gem Quest 1', time: '12:00', day: 'Saturday' },
      { class: 'GEM', name: 'Saturday Gem Quest 2', time: '18:00', day: 'Saturday' },
      { class: 'GEM', name: 'Saturday Gem Quest 3', time: '22:00', day: 'Saturday' },
      { class: 'GEM', name: 'Sunday Gem Quest 1', time: '12:30', day: 'Sunday' },
      { class: 'GEM', name: 'Sunday Gem Quest 2', time: '19:00', day: 'Sunday' },
      { class: 'GEM', name: 'Sunday Gem Quest 3', time: '23:00', day: 'Sunday' }
    ];
    this.timezone = 'America/Los_Angeles';
  }

  authorized(user) {
    const users = this.client.config.countdown_authorized_users;

    return users.includes(user.id);
  }

  getCountdown(date) {
    const { timezone } = this;
    date = moment(date, 'x').tz(timezone);
    const now = moment().tz(timezone).format('x');
    const remaining = date - now;
    let days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    let hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    days = days < 1 ? '' : `${days}d `;
    hours = hours < 10 ? `0${hours}:` : `${hours}:`;
    minutes = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return days.concat(hours, minutes, seconds);
  }

  async getCountdowns() {
    const { client: { persist }, timezone } = this;

    const countdowns = await persist.get('countdowns');
    const oldLength = Object.keys(countdowns).length;

    for (const key in countdowns) {
      const countdown = countdowns[key];
      const date = moment(countdown).seconds(0);
      const now = moment().tz(timezone);
      const expired = now.isAfter(date);

      if (expired)
        delete countdowns[key];
    }

    if (Object.keys(countdowns).length !== oldLength)
      persist.set('countdowns', countdowns);

    return countdowns;
  }

  async run(message, [command, ...details]) {
    const hasCommand = ['add', 'remove', 'test'].includes(command);
    const authorized = hasCommand && this.authorized(message.author);

    if (!hasCommand || !authorized) return this.defaultCommand(message);

    const { client: { persist }, timezone } = this;
    const countdowns = await this.getCountdowns();
    let date;
    let name;

    switch (command.toLowerCase()) {
      case 'add': {
        date = moment.tz(details.pop(), timezone).seconds(0);
        name = details.join(' ');

        Object.assign(countdowns, { [name]: date });
        await persist.set('countdowns', countdowns);

        return message.reply(`\`${name}\` countdown added! Expires in ${this.getCountdown(date)}`);
      }

      case 'remove': {
        name = details.join(' ');

        if (countdowns[name]) {
          delete countdowns[name];
          await persist.set('countdowns', countdowns);

          return message.reply(`\`${name}\` countdown removed!`);
        }

        return message.reply(`countdown named \`${name}\` not found.`);
      }

      case 'test': {
        date = moment.tz(details[0], timezone).seconds(0);

        return message.reply(`the provided date is in ${this.getCountdown(date)}`);
      }
    }
  }

  async defaultCommand(message) {
    const { timezone, preset, util } = this;
    let countdowns = util.collection();

    for (const countdown of preset) {
      const t = countdown.time.split(':');
      const hour = t[0];
      const minute = t[1];
      const date = moment().tz(timezone).hours(hour).minutes(minute).seconds(0);
      const now = moment().tz(timezone);
      const dayNow = now.format('dddd');
      const expired = () => now.isAfter(date);
      const everyday = countdown.day === '*';
      const today = everyday || dayNow === countdown.day;

      if (everyday && expired(date))
        if (countdown.class) {
          let offset;

          switch (countdown.class) {
            // case 'ENH':
            //   offset = 60;
            //   break;
            // case 'GEM':
            //   offset = 30;
            //   break;
            case 'DLY':
              offset = 60 * 24;
              break;
          }

          date.add(offset, 'minute');
        }

      if ((today || everyday) && !expired())
        countdowns.set(countdown.name, date);
    }

    const userCountdowns = await this.getCountdowns();

    if (Object.keys(userCountdowns).length)
      for (const key in userCountdowns) {
        const countdown = userCountdowns[key];
        const date = moment(countdown).tz(timezone).seconds(0);

        countdowns.set(key, date);
      }

    countdowns = countdowns.sort((a, b) => a - b);
    const embed = util.embed()
      .setColor(0x00AE86);

    for (const countdown of countdowns.keys()) {
      const name = countdown;
      const date = moment(countdowns.get(countdown)).tz(timezone);

      embed.addField(name, `❯ ${this.getCountdown(date)}`);
    }

    return message.channel.send(embed);
  }
}

module.exports = CountdownCommand;
