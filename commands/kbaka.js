const Command = require('../struct/Command');
const insults = require('../datas/insults.json');

class BakaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kbaka',
      description: {
        content: 'Adds/Removes a user from baka list— a list of users that Alyssa should try to insult desperately.',
        usage: '[mention username]',
        examples: ['@User#0001']
      },
      permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      authorizedUsers: client.config.kbaka_authorized_users
    });
  }

  async run(message) {
    if (message.channel.type !== 'text')
      return message.reply('this command is not available in DMs. You need to be on a text channel (in a server)');

    const mentions = message.mentions;

    if (!mentions.users.size)
      return message.reply('please provide a username using via mention.');

    const user = mentions.users.first();

    const { client: { persist } } = this;

    const bakas = await persist.get('bakas');
    const index = bakas.indexOf(user.id);
    let sentMessage;

    if (index < 0) {
      bakas.splice(index, 1);
      sentMessage = await message.reply(`removing ${user.tag} from the baka list...`);
    } else {
      bakas.push(user.id);
      sentMessage = await message.reply(`adding ${user.tag} into the baka list...`);
    }

    await persist.set('bakas', bakas);

    return sentMessage.edit(`${message.author}, successfully updated the baka list.`);
  }

  insult(message) {
    const {
      util,
      util: { config: { thumbrooturl: thumbRootURI } }
    } = this;
    const alyssaIMG = `${thumbRootURI}/images_bot/AlyssaPortrait.jpg`;
    const embed = util.embed()
      .setAuthor('Alyssa')
      .setThumbnail(alyssaIMG)
      .setColor(0x00AE86);
    const array = insults.insult;
    const insult = array[Math.floor(Math.random() * array.length)];

    embed.setDescription(insult);
    message.channel.send(embed);
  }
}

module.exports = BakaCommand;
