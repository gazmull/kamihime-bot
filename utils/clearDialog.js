// --- imported from Eros Bot
// --- Bot reacts to the message sent by the bot, prompting ther user to whether delete or not the message for 30 seconds
// --- Great for users using intrusive commands such as /kh on non-bot-commands channel

module.exports = async (message, dialog) => {
  try {
      if(
          !message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES') ||
          !message.channel.permissionsFor(message.client.user).has('ADD_REACTIONS')
        ) return;
      await dialog.react('🗑');
      const toDelete = await dialog.awaitReactions((r, u) =>
          r.emoji.name === '🗑' && u.id === message.author.id, { max: 1, time: 30 * 1000, errors: ['time'] });
      if(toDelete.first())
          await dialog.delete();
  }
  catch (c) {
      dialog.clearReactions();
      typeof c.stack !== 'undefined' ? message.client.logger.error(c) : null;
  }
};