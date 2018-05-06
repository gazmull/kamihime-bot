const Command = require('../struct/Command');

class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'halp'],
      description: {
        content: 'Displays commands available.',
        examples: ['kh', 'kp'],
        usage: '[command]'
      },
      permissions: ['SEND_MESSAGES']
    });
  }

  run(message, args) {
    if (!args.length) return this.defaultHelp(message);

    args = args.join(' ');
    const { client, prefix } = this;
    const command = client.commands.get(args) || client.commands.filter(c => c.aliases && c.aliases.includes(args)).first();

    if (!command) return this.defaultHelp(message);

    const { name, aliases, description: { content, usage, examples }, permissions } = command;

    return message.channel.send([
      `**Command: ${name.toUpperCase()}**\n\`\`\`css\n${Array.isArray(content) ? content.join('\n') : content}\`\`\``,
      aliases
        ? `\`\`\`css\n#Aliases\n${aliases.join(', ')}\`\`\``
        : '',
      examples.length && usage
        ? `\`\`\`css\n#Usage\n${prefix}${name} ${usage}\n\n#Examples\n${
          examples.map(e => `${prefix}${name} ${e}`).join('\n')}\`\`\``
        : '',
      permissions
        ? `\`\`\`css\n#Bot-Permissions-Required\n${permissions.map(e => e).join(', ')}\`\`\``
        : ''
    ].join(''));
  }

  defaultHelp(message) {
    const { prefix, formatMessage } = this;
    const helpText = [
      '#Kamihime-Bot',
      '❯ A Discord bot for the Kamihime Project from Nutaku.com',
      '❯ All database information courtesy of kamihime-project.wikia.com',
      '❯ [Special Credits]: Xkpaulo & AzureSkye from kamihime-project.wikia.com\n',

      '#Command-List',
      `❯ Type '${prefix}help' for this general help message and '${prefix}help [command]' to get more info on a specific command. (Example: ${prefix}help kh)\n`,
      '[kh] - Displays info about a specific in-game character, weapon or accessory.',
      '[countdown] - Displays countdowns related to in-game events.',
      '[latest] - Displays the 15 latest objects downloaded from the wiki website.',
      '[kp] - Displays or updates member profiles',
      // '[ku] - Displays or updates union profiles',
      '[kudos] - Sends a Kudos Point to someone',
      '[invitebot] - Provides a link to install this bot on your own Discord server\n',

      '❯ Don\'t include the example brackets when using commands!\n',

      '#Anti-Spam-Advice',
      '❯ Using this bot on text channels can be very intrusive, please try to limit spam.',
      '❯ For personal uses, we recommend you to direct message the bot with the commands.'
    ].join('\n');

    return formatMessage(message, helpText);
  }

  formatMessage(message, text) {
    return message.channel.send(`\`\`\`css\n${text}\`\`\``);
  }
}

module.exports = HelpCommand;
