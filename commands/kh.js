const Command = require('../struct/Command');
const fuzzy = require('fuzzy');
const shortNames = require('../datas/shortNames');
const {
  Eidolon,
  Kamihime,
  Soul,
  Weapon,
  Accessory
} = require('../struct/KHInfo');

class KHCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kh',
      description: {
        content: [
          'Displays info about a specific in-game, character, weapon, or accessory.\n',

          '#Available-Dash-Parameters',
          '[-k], [--kamihime]    Search by Kamihime',
          '[-e], [--eidolon]     Search by Eidolon',
          '[-s], [--soul]        Search by Soul',
          '[-w], [--weapon]      Search by Weapon',
          '[-a], [--accessory]   Search by Accessory\n',

          '#Tips',
          '❯ Fuzzy logic is applied to [name], it will try to match incomplete or misspelt inputs (Example: ytaga => displays Yatagarasu)',
          '❯ Having a dash parameter will give you better result when looking for a specific item',
          '❯ You can click the name field in the datasheet response to visit the related wiki page.'
        ],
        examples: ['masamune', 'masamune --soul', '--soul masamune'],
        usage: '[name] [optional: dash parameter]'
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      awaitingPrompt: true
    });
  }

  get fuzzyOptions() {
    return { extract: el => el.name };
  }

  async run(message, args) {
    const {
      fuzzyOptions,
      triggerDialog,
      failReply,
      toTitleCase,
      prefix,
      client: { khDB: { all: khArray } }
    } = this;

    let name = args.join(' ');
    let parameter = null;

    if (!name)
      return failReply(message);

    const parameterRegExp = /(?:^| )-{1,2}([\w]+)/g;
    const potentialParameter = parameterRegExp.test(name);

    if (potentialParameter) {
      let toTruncate = -1;

      for (const arg of args)
        if (parameterRegExp.test(arg))
          toTruncate = args.indexOf(arg);

      parameter = toTruncate === args.length - 1 ? args.pop() : args.shift();
      parameter = toTitleCase(parameter.replace(parameterRegExp, '$1'));
      name = args.join(' ');
    }

    parameter = parameter === 'K' || parameter === 'Kamihime'
      ? 'Kamihime'
      : parameter === 'E' || parameter === 'Eidolon'
        ? 'Eidolon'
        : parameter === 'S' || parameter === 'Soul'
          ? 'Soul'
          : parameter === 'W' || parameter === 'Weapon'
            ? 'Weapon'
            : parameter === 'A' || parameter === 'Accessory'
              ? 'Accessory'
              : null;

    if (potentialParameter && !parameter)
      return message.reply(`invalid parameter. See \`${prefix}help kh\` for examples.`);

    const cleanName = name.replace(/[()]/g, '\\$&');
    const nameRegExp = new RegExp(cleanName, 'i');
    let found = false;

    if (name.length < 3) {
      for (const item of shortNames) {
        const elName = item.name;
        const elType = item.objectType;
        const nameCheck = name.length < 3 && (nameRegExp.test(elName) || elName === toTitleCase(name));
        const parameterCheck = parameter && parameter === elType;

        if ((parameterCheck || !parameterCheck) && nameCheck) {
          found = true;
          break;
        }
      }

      if (!found)
        return failReply(message);
    }

    let results = fuzzy.filter(name, khArray(), fuzzyOptions);
    const data = results.map(el => el.original);
    results = parameter ? data.filter(el => el.objectType === parameter) : data;
    const sentMessage = await message.channel.send('Preparing...');

    if (!results.length)
      return sentMessage.edit(
        `${message.author}, query \`${name}\`${parameter ? ` with parameter \`${parameter}\`` : ''} is not found.`
      );
    else if (results.length === 1 || found)
      return triggerDialog(sentMessage, results[0]);

    results = results.slice(0, 9);

    await sentMessage.edit([
      `The following items match with query '${name}'${parameter ? ` and parameter '${parameter}'` : ''}:`,
      `\n\`\`\`js\n{\n\t0_Void: "Cancel the Selection",\n${results.map(el => `\t${results.indexOf(el) + 1}_${el.objectType}: "${el.name}"`).join(',\n')}\n}\`\`\``,
      '\nSelect an item by their designated number to prompt me to continue. Say `cancel` or `0` to cancel the command.',
      '\nExpires within 30 seconds.'
    ].join(''));

    try {
      const responses = await message.channel.awaitMessages(
        m =>
          m.author.id === message.author.id &&
            (m.content.toLowerCase() === 'cancel' || parseInt(m.content) === 0 ||
            (parseInt(m.content) >= 1 && parseInt(m.content) <= results.length)), {
          max: 1,
          time: 30 * 1000,
          errors: ['time']
        }
      );

      const response = responses.first();

      if (response.content.toLowerCase() === 'cancel' || parseInt(response.content) === 0)
        return sentMessage.edit('Selection cancelled.');

      const index = results[parseInt(response.content) - 1];

      if (message.channel.type === 'text' && message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES'))
        response.delete();

      return this.triggerDialog(sentMessage, index);
    } catch (c) {
      if (c instanceof Error) this.handleError(c);
      else sentMessage.edit('Selection expired.');
    }
  }

  triggerDialog(dialog, result) {
    let embed = null;

    switch (result.objectType) {
      case 'Kamihime':
        embed = new Kamihime(result);
        break;
      case 'Eidolon':
        embed = new Eidolon(result);
        break;
      case 'Soul':
        embed = new Soul(result);
        break;
      case 'Weapon':
        embed = new Weapon(result);
        break;
      case 'Accessory':
        embed = new Accessory(result);
        break;
    }

    return dialog.edit(embed.format());
  }

  failReply(message) {
    return message.reply('for the search query to be effective, you must enter at least three characters.');
  }

  toTitleCase(value) {
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
  }
}

module.exports = KHCommand;
