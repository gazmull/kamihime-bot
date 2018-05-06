const Command = require('../struct/Command');
const moment = require('moment-timezone');
const momentZones = require('moment-timezone/data/meta/latest.json');
const fuzzy = require('fuzzy');

class UserProfileCommand extends Command {
  constructor(client) {
    const { config: { prefix } } = client;

    super(client, {
      name: 'kp',
      aliases: ['profile'],
      description: {
        content: [
          'Displays a profile registered in the bot\'s database.\n',

          '#Profile-Display-Commands',
          `${prefix}kp => Displays your own profile.`,
          `${prefix}kp [mention user] => Displays a profile of another user. (Text Channels only)\n`,

          '#Profile-Editing-Commands',
          '❯ Using these commands in text channels is considered as spam, and you will be redirect to DMs by the bot.',
          `${prefix}kp set desc [text] => Edit profile's description. (MAX: 512 Characters & 15 Lines / Shift+Enter for multi-line description)`,
          `${prefix}kp set gid [ID] => Edit your Nutaku Game ID.`,
          `${prefix}kp set country [2-letter country code] = Edit your country and timezone.`,
          `${prefix}kp set lang [text] => Edit languages you can use on Discord.`,
          `${prefix}kp set level [level] => Edit your in-game level.`,
          `${prefix}kp set fav [character name] => Edit your favourite character.`
        ],
        usage: '[mention user / "set"] [edit profile command] [details]',
        examples: ['', '@yourName#0110', 'set lang engrish', 'set gid 21003853']
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });

    this.defaultDescription = [
      'This is the default description.',
      `Use the command '${this.prefix}help kp' for the list of functions available to edit your profile.`
    ].join('\n');
  }

  async run(message, [command, ...details]) {
    const { client: { db, khDB }, client, util, prefix } = this;
    const userRegex = /<@!?(\d{17,20})>/;

    if (!command || userRegex.test(command)) {
      if (command && message.channel.type === 'dm')
        return message.reply([
          'Sorry, searching a user is related to a memberlist, it\'s not possible in DMs.',
          'You need to be on a text channel to search for a user.'
        ].join(' '));

      let user = command ? command.replace(userRegex, '$1') : null;
      user = user ? await client.fetchUser(user) : message.author;

      if (!user)
        return message.reply('sorry, I cannot find the user you\'re looking for.');

      const [[row]] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id]);

      if (row) return this.display(message, user, row);

      return this.create(user, message);
    } else if (command.toLowerCase() === 'set') {
      if (message.channel.type !== 'dm') {
        message.reply('The response had been sent to you by direct message.');

        message.author.send([
          '```css',
          'To limit spam in text channels, updating profiles will be redirected to direct messages.',
          '[Please type your next update commands here.]',
          '[Do not use text channels for updating your profile.]',
          `If you need help, type '${prefix}help kp'`,
          '```',
          '```css',
          `Your last command was [${message.content}], and my response is:`,
          '```'
        ].join('\n'));
      }

      const dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss');
      const parameter = details[0] ? details.shift().toLowerCase() : null;
      const presetMessages = {
        country: [
          `Please provide our 2 letters country code. (Example: '${prefix}kp set country us')`,
          'For a full list of supported country codes, visit https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements'
        ],
        desc: ['Please provide a description text.'],
        gid: ['Please provide your Nutaku game ID.'],
        level: ['Please provide your current level.'],
        lang: ['Please provide the languages you\'re used to.'],
        fav: ['Please provide a character name (Kamihime, Soul, or Eidolon).'],
        default: `Unknown set profile command. Please use \`${prefix}help kp\` for more info.`
      };

      if (parameter && !details)
        return message.author.send(presetMessages[parameter].join('\n'));

      switch (parameter) {
        default:
          return message.author.send(presetMessages.default);

        case 'country': {
          const [cc, tz] = details;
          const countryCode = cc.toUpperCase() || null;
          let timezone = parseInt(tz) || null;
          const timezones = this.getCountryZones(countryCode);

          if (!timezones || !timezones.length)
            return message.author.send([
              `${countryCode} is not a valid country code (2 letter)`,
              'For a full list of supported country codes, visit https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements'
            ]);

          if (timezones.length > 1 && !timezone)
            return message.author.send([
              'There is more than one timezone available for your country, please select the desired timezone from the list below using the command:',
              `${prefix}kp set country ${countryCode} [timezone number] (Example: ${prefix}kp set country ${countryCode} 1)\n`,
              '```',
              timezones.map(z => `(${timezones.indexOf(z)} + 1) - ${z}`).join('\n'),
              '```'
            ].join('\n'));

          else if (timezone > timezones.length)
            return message.author.send(`The timezone number ${timezone} is not available for your country.`);

          else if (timezone && timezone <= timezones.length)
            timezone--;

          timezone = timezones[timezone];

          if (!moment.tz.zone(timezone))
            return message.author.send(`${timezone} is not a valid timezone.`);

          await db.execute(
            'UPDATE `users` SET `user_country_code`=?, `user_timezone`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [
              countryCode,
              timezone,
              dateUpdated,
              message.author.id
            ]);

          return message.author.send(`Country set to \`${countryCode}\` and timezone set to \`${timezone}\`.`);
        }

        case 'desc': {
          const description = details.join(' ');
          const lines = description.split('\n');
          const reachedMaxChars = description.length > 512 || lines.length > 15;

          if (reachedMaxChars)
            return message.author.send('Description is only limited to 15 lines and 512 characters.');

          await db.execute(
            'UPDATE `users` SET `user_description`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [
              description,
              dateUpdated,
              message.author.id
            ]);

          return message.author.send(`Description profile set to \`\`\`\n${description}\`\`\`.`);
        }

        case 'gid': {
          let [ID] = details;
          ID = parseInt(ID);

          if (ID <= 0 || isNaN(ID))
            return message.author.send(`\`${ID}\` is not a valid game ID.`);

          await db.execute(
            'UPDATE `users` SET `user_nutaku_id`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [
              ID,
              dateUpdated,
              message.author.id
            ]);

          return message.author.send(`Nutaku Game ID set to \`${ID}\`.`);
        }

        case 'level': {
          let [level] = details;
          level = parseInt(level);

          if (level <= 0 || isNaN(level))
            return message.author.send(`\`${level}\` is not a valid level.`);

          await db.execute(
            'UPDATE `users` SET `user_level`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [
              level,
              dateUpdated,
              message.author.id
            ]);

          return message.author.send(`Game Level set to \`${level}\`.`);
        }

        case 'lang': {
          const language = details.join(' ');

          await db.execute(
            'UPDATE `users` SET `user_lang`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [
              language,
              dateUpdated,
              message.author.id
            ]);

          return message.author.send(`Language set to \`${language}\`.`);
        }

        case 'fav': {
          let waifu = details.join(' ');
          const database = khDB.all();

          if (waifu.length < 2)
            return message.author.send('You must enter at least two letters.');

          let results = fuzzy.filter(waifu, database, { extract: el => el.name });
          results = results.map(el => el.original);

          if (!results.length)
            return message.author.send(`No character matches your query \`${waifu}\`.`);

          waifu = results[0];

          if (waifu.objectType === 'Weapon')
            return message.author.send(`Sorry, but your query matches \`${waifu.name}\`, but it's a weapon...`);

          const waifuLink = util.config.wikidomain + waifu.link;

          await db.execute(
            'UPDATE `users` SET `user_waifu`=?, `user_waifu_link`=?, `user_updated_on`=? WHERE `user_discord_id`=?', [
              waifu.name,
              waifuLink,
              dateUpdated,
              message.author.id
            ]);
          message.author.send(`Favorite character set to \`${waifu.name}\`.`);
        }
      }
    } else
      return message.reply('please mention a user.');
  }

  async create(user, message = null) {
    const { client: { db } } = this;

    await db.execute([
      'INSERT INTO `users`',
      '(`user_discord_id`, `user_username`, `user_discriminator`, `user_description`) VALUES(?,?,?,?)',
      'ON DUPLICATE KEY UPDATE `user_discord_id` = ?'
    ].join(' '),
    [
      user.id,
      user.username,
      user.discriminator,
      this.defaultDescription,
      user.id
    ]);
    this.logger('info', `Created profile for ${user.tag} (${user.id})`);

    if (message) return this.display(message, user);
  }

  async display(message, user, res = null) {
    const { client: { db }, util } = this;
    const unionName = 'UnionName PlaceHolder';
    const unionRole = 'coming soon';
    const unionInvite = 'https://discord.gg/QGUhtaK';

    if (!res) {
      const [[row]] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id]);

      if (row)
        res = row;

      return message.reply('I cannot retrieve the profile.');
    }

    const cleanWaifuLink = res.user_waifu_link.replace(/(\(|\))/g, '\\$&');

    const nickname = user.nickname ? `${user.nickname} / ` : '';
    const name = `${nickname}${user.username}`;
    const createdDate = moment(res.user_created_on).format('MMMM DD YYYY');
    const updatedDate = res.user_updated_on ? moment(res.user_updated_on).format('MMMM DD YYYY HH:mm:ss') : 'Never updated';
    const countryFlag = res.user_country_code ? `:flag_${res.user_country_code.toLowerCase}:` : ':earth_africa:';
    const timezone = res.user_timezone ? moment().tz(res.user_timezone) : null;
    const localTime = timezone ? timezone.format('dddd, HH:mm') : 'Not provided';
    const nutakuID = res.user_nutaku_id || 'Not provided';
    const reputationText = res.user_rep_point ? `${res.user_rep_point} kudos received` : 'No kudos yet';
    const userLang = res.user_lang || 'English';
    const waifu = res.user_waifu_link ? `[${res.user_waifu}](${cleanWaifuLink})` : 'None';
    const avatarURL = user.displayAvatarURL;
    const presence = user.presence.status === 'offline'
      ? res.user_last_online
        ? `Last visit: ${moment(res.user_last_online).fromNow()}`
        : 'OFFLINE'
      : user.presence.status.toUpperCase();
    const embed = util.embed()
      .setTitle(`:regional_indicator_u: ${unionName} ${unionRole}`)
      .setAuthor(`Name: ${name}`)
      .setColor(0x00AE86)
      .setDescription(`\`\`\`\n${res.user_description}\`\`\``)
      .setThumbnail(avatarURL)
      .addField(':arrow_up: Player Level', `Level ${res.user_level}`, true)
      .addField(':id: Game Player ID', nutakuID, true)
      .addField(':speech_left: Spoken Language', userLang, true)
      .addField(`${countryFlag} Country & Local Time`, localTime, true)
      .addField(':military_medal: Kudos Points', reputationText, true)
      .addField(':heart: Favorite Character', waifu, true)
      .addField(':timer: Created On', createdDate, true)
      .addField(':hourglass: Online Status', presence, true)
      .setFooter(`Profile updated on: ${updatedDate}`);

    if (unionInvite)
      embed.setURL(unionInvite);

    return message.channel.send(embed);
  }

  getCountryZones(countryCode) {
    if (!countryCode) return null;

    countryCode = countryCode.toUpperCase();

    return momentZones.countries[countryCode] && momentZones.countries[countryCode].zones;
  }
}

module.exports = UserProfileCommand;
