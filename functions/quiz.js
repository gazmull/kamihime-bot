const { RichEmbed } = require('discord.js');
let goodResponse = null;

function initQuestion(client) {
  const {
    config: {
      thumbrooturl: thumbRootURI,
      quiz: {
        channel_id: channelID,
        thumbrootencryptedurl: thumbRootEncryptedURI
      }
    },
    logger,
    khDB
  } = client;
  const channel = client.channels.get(channelID);

  if (!channel) logger.error('Cannot find Quiz Channel ID...');

  const khArray = khDB.all();
  const itemsTotal = khArray.length;
  const randomise = () => Math.floor(Math.random() * itemsTotal);
  const responses = [];
  const itemID = randomise();
  const item = khArray[itemID];
  goodResponse = Math.floor(Math.random() * 4);
  let itemThumb = `${thumbRootURI}${item.portraiturl || item.thumbnailurl}`;
  const encryptedURI = khDB.encrypt(item.portraiturl);

  if (encryptedURI)
    itemThumb = `${thumbRootEncryptedURI}/${encryptedURI}`;

  for (let i = 0; i < 4; ++i)
    responses.push(randomise());

  responses[goodResponse] = itemID;

  const embed = new RichEmbed()
    .setTitle('Who is this character?')
    .setAuthor(`Kamihime Quiz: ${item.name}`)
    .setThumbnail(itemThumb)
    .setColor(0x00AE86);

  const description = [];

  for (let i = 0; i < 4; ++i)
    description.push(`${i + 1} - ${khArray[responses[i]].name}`);

  embed.setDescription(description);

  return channel.send(embed);
}

function readAnswer(client, message) {
  const response = (parseInt(message) - 1) || 0;

  if (response < 1 || response > 4) return;

  if (response === goodResponse)
    return message.channel.send('Correct answer!');

  message.channel.send('Sorry, the answer is wrong!');

  return initQuestion(client);
}

module.exports = { initQuestion, readAnswer };
