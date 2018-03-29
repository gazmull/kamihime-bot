const Command = require('../struct/Command');
const moment = require('moment-timezone');
// const momentZones = require('moment-timezone/data/meta/latest.json');
const { FieldsEmbed } = require('discord-paginationembed');

class UnionProfileCommand extends Command {
  constructor(client) {
    const { config: { prefix } } = client;

    super(client, {
      name: 'ku',
      description: {
        content: [
          'Displays a union info from the bot\'s database.\n',

          '#Union-Display-Commands',
          `${prefix}ku => displays union information of the current Discord server.`,
          `${prefix}ku [mention user] => displays union information of the user mentioned.`,
          `${prefix}ku [union ID] => displays union information based on ID.`,
          `${prefix}ku list [page number] => displays the list of registered unions.\n`,

          '#Discord-Server-Owner-Commands',
          `${prefix}ku reset => resets the union leader to the Discord server owner.`,
          `${prefix}ku leader [mention user] => sets the mentioned user as the union leader. (If your union leader isn't the server owner)\n`,

          '#Discord-Server-Owner-or-Union-Leader-Commands',
          `${prefix}ku set name [text] => updates your union name.`,
          `${prefix}ku set desc [text] => updates your union description.`,
          `${prefix}ku set discordinvite [link] => updates your Discord server's invite link.`,
          `${prefix}ku set recruitment [on/off] => activate/deactivate recruitment. (default: off)`,
          `${prefix}ku set recruitdesc [text] => updates your recruitment description. (displayed if recruitment is active)`,
          `${prefix}ku set timezone => updates your union's timezone for gathering.`,
          `${prefix}ku set bursttime => updates your union's burst time.`,
          `${prefix}ku set private [on/off] => excludes/includes your server from the public union list. (default: off)`
        ],
        usage: '[mention user/union ID/ku sub-command] [set profile command] [details]',
        examples: ['', '@yourName#0011', '1', 'list 3', 'set name Psyducks']
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      authorizedUsers: ['361433266869501953', '319102712383799296']
    });

    this.userRegex = /<@!?(\d{17,20})>/;
  }

  async run(message, [command, ...details]) {
    command = command ? command.toLowerCase() : null;

    switch (command) {
      case 'set':
        return this.set(message, details);
      case 'reset':
        return this.reset(message, details);
      case 'leader':
        return this.setLeader(message, details);
      case 'list':
        return this.list(message, details);
    }

    const { client: { db }, userRegex } = this;

    if (!command || userRegex.test(command)) {
      if (command && message.channel.type === 'dm')
        return message.reply([
          'Sorry, searching a user is related to a memberlist, it\'s not possible in DMs.',
          'You need to be on a text channel to search for a user.'
        ].join(' '));

      let user = command ? command.replace(userRegex, '$1') : null;
      user = user ? await this.client.fetchUser(user) : message.author;

      if (!user)
        return message.reply('sorry, I cannot find the user you\'re looking for.');

      const [[userRow]] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [user.id]);

      if (!userRow)
        return message.reply(`${user.tag} is not registered in our database.`);

      const [[unionRow]] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [userRow.user_discord_union_id]);

      if (!unionRow)
        return message.reply(`${user.tag} has no union registered to his/her profile.`);

      return this.display(message, unionRow);
    } else if (parseInt(command) && !userRegex.test(command)) {
      const [[unionRow]] = await db.execute('SELECT * FROM `unions` WHERE `union_id` = ?', [command]);

      if (!unionRow)
        return message.reply('sorry, I cannot find the union you\'re looking for.');

      return this.display(message, unionRow);
    }
  }

  set(message, details) {
    const { prefix } = this;

    if (message.channel.type !== 'dm') {
      message.reply('The response had been sent to you by direct message.');

      message.author.send([
        '```css',
        'To limit spam in text channels, updating profiles will be redirected to direct messages.',
        '[Please type your next update commands here.]',
        '[Do not use text channels for updating your union profile.]',
        `If you need help, type '${prefix}help ku'`,
        '```',
        '```css',
        `Your last command was [${message.content}], and my response is:`,
        '```'
      ].join('\n'));
    }

    // const dateUpdated = moment().format('YYYY-MM-DD HH:mm:ss');
    const parameter = details[0] ? details.shift().toLowerCase() : null;
    const presetMessages = {
      name: null,
      nbmembers: null,
      desc: null,
      default: `Unknown set profile command. Please use \`${prefix}help ku\` for more info.`
    };

    if (parameter && !details)
      return message.author.send(presetMessages[parameter].join('\n'));

    switch (parameter) {
      default:
        return message.author.send(presetMessages.default);

      case 'name':
      case 'nbmembers':
      case 'desc':
        return null;
    }
  }

  async setLeader(message, details) {
    if (message.channel.type === 'dm')
      return message.reply([
        'Sorry, searching a user is related to a memberlist, it\'s not possible in DMs.',
        'You need to be on a text channel to search for a user.'
      ].join(' '));

    const { userRegex, client: { db } } = this;
    let user = details[0] ? details.shift() : null;

    if (!userRegex.test(user))
      return message.reply('please provide a username.');

    if (message.guild.ownerID !== message.author.id)
      return message.reply('sorry, leader command is only available to this server\'s owner.');

    user = user.replace(userRegex, '$1');
    user = user ? await message.guild.fetchMember(user) : null;
    user = user ? user.user : null;

    if (!user)
      return message.reply(`${user} cannot be found in this server.`);

    await db.execute('UPDATE `unions` SET `union_discord_owner_id`=? WHERE `union_discord_guild_id`=?', [user.id, message.guild.id]);
    this.logger('info', `Union ${message.guild.name}'s leader has been updated to ${user.tag} (${user.id})`);

    return message.reply(`Union leader (${message.guild.name}) has been updated to ${user.tag}.`);
  }

  async reset(message, details) {
    const parameter = details[0] ? details.shift().toLowerCase() : null;

    switch (parameter) {
      case 'all': {
        const { client, client: { db }, util: { config: { owners: botOwners } } } = this;

        if (!botOwners.includes(message.author.id))
          return message.reply('only bot owners are allowed to use this command.');

        await db.execute('DELETE FROM `unions`');

        const guilds = client.guilds.values();
        let verified = 0;

        for (const guild of guilds)
          try {
            await this.create(guild);
            verified++;
          } catch (err) {
            this.logger('error', `Could not create union ${guild.name}`);
          }

        return message.reply(`${verified} servers updated! (Expected: ${client.guilds.size})`);
      }

      default: {
        if (message.channel.type === 'dm')
          return message.reply('This command is related to Discord server. You need to be in a text channel.');

        if (message.guild.ownerID !== message.author.id)
          return message.reply('sorry, this command is only available to Discord server owner.');

        const { prefix } = this;

        if (details.length)
          return message.reply(`unknown reset command. Please use \`${prefix}help ku\` for more info.`);

        await this.client.db.execute('DELETE FROM `unions` WHERE `union_discord_guild_id` = ? ', [message.guild.id]);
        await this.create(message.guild);

        const union = await this.getByID(message.guild.id);

        if (!union)
          return message.reply('I cannot find this union in our database.');

        return this.display(message, union);
      }
    }
  }

  async list(message, details) {
    let page = details[0] ? details.shift() : NaN;
    page = isNaN(page) ? 1 : parseInt(page);
    const perPage = 20;
    const { client: { db }, prefix } = this;

    const [rows] = await db.execute('SELECT * FROM `unions` INNER JOIN `users` WHERE unions.union_discord_owner_id = users.user_discord_id AND `union_active` = 1 ORDER BY unions.union_recruitment DESC', null);

    if (!rows.length)
      return message.reply('not enough unions to list.');

    return new FieldsEmbed()
      .setArray(rows)
      .setAuthorizedUser(message.author)
      .setChannel(message.channel)
      .setElementsPerPage(perPage)
      .setPage(page)
      .showPageIndicator(true)
      .setColor(0x00AE86)
      .addField('Tip', [
        `${prefix}ku list [page num] or press ↗ to skip to a specific page.`,
        '\\✔️ - Recruitment is open',
        '\\❌ - Recruitment is close',
        `${prefix}ku [Union ID] => displays more details about the union.`
      ])
      .formatField('Union ID - Name', i => `${i.union_recruitment ? '\\✔️' : '\\❌'} ${i.union_id} - ${i.union_name}`)
      .formatField('Members', i => i.union_discord_nb_member)
      .formatField('Leader', i => `${i.user_username}#${i.user_discriminator}`)
      .build();
  }

  async create(guild) {
    const dateCreated = moment().format('YYYY-MM-DD HH:mm:ss');
    const { client: { db, commands } } = this;
    const [[row]] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guild.id]);

    if (row)
      return this.logger('info', `${guild.name} (${guild.id}) is already registered.`);

    await db.execute(
      'INSERT INTO `unions` (`union_discord_guild_id`, `union_discord_guild_name`, `union_discord_owner_id`, `union_name`, `union_created_on`,`union_active`) VALUES(?,?,?,?,?,1) ON DUPLICATE KEY UPDATE `union_discord_guild_id` = ?', [
        guild.id,
        guild.name,
        guild.ownerID,
        guild.name,
        dateCreated,
        guild.id
      ]);

    this.logger('info', `Union ${guild.name} (${guild.id}) created.`);

    const [[uRow]] = await db.execute('SELECT * FROM `users` WHERE `user_discord_id` = ?', [guild.ownerID]);

    if (!uRow)
      commands.get('kp').create(guild.owner.user);

    await db.execute('UPDATE `users` SET `user_discord_union_id` = ?, `user_nutaku_role` = ? WHERE `user_discord_id` = ?', [
      guild.id,
      'Leader',
      guild.ownerID
    ]);

    this.logger('info', `Union ${guild.name} (${guild.id})'s Leader has been updated to ${guild.owner.user.tag}.`);

    await db.execute('UPDATE `unions` SET `union_discord_owner_id` = ?, `union_discord_nb_member` = ? WHERE `union_discord_guild_id` = ?', [
      guild.ownerID,
      guild.memberCount,
      guild.id
    ]);

    this.logger('info', `Union ${guild.name} (${guild.id})'s member count updated (${guild.memberCount}).`);

    return true;
  }

  async getByID(guildID) {
    const { client: { db } } = this;
    const [[row]] = await db.execute('SELECT * FROM `unions` WHERE `union_discord_guild_id` = ?', [guildID]);

    return row || null;
  }

  async display(message, union) {
    if (!union)
      return message.reply('I cannot find the union specified, or this user\'s union.');

    const { client, util } = this;
    const {
      union_name: name,
      union_id: id,
      union_discord_guild_id: guildID,
      union_discord_owner_id: ownerID
    } = union;
    const guild = client.guilds.get(guildID);
    const owner = client.users.get(ownerID) || await client.fetchUser(ownerID);
    const embed = util.embed()
      .setAuthor(`${name} (ID #${id})`)
      .setTitle(`:crown: ${owner.tag}`)
      .setColor(0x00AE86)
      .setThumbnail(guild.iconURL || `${util.config.thumbrooturl}/images_bot/default_avatar.png`)
      .setDescription('```\nUnion description text```');

    return message.channel.send(embed);
  }
}

module.exports = UnionProfileCommand;
