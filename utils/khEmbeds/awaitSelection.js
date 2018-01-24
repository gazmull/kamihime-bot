// --- Awaits the command user's response when there are multiple results from /kh search

const config = require('../../config.json');
const parseResult = (objectType, selected) => {
    return selected == objectType;
};

module.exports = async (message, dialog, result) => {
    try {
        const responses = await message.channel.awaitMessages(
            m =>
                m.author.id === message.author.id &&
                ( m.content.toLowerCase() === 'cancel' || parseInt(m.content) === 0 ||
                ( parseInt(m.content) >= 1 && parseInt(m.content) <= result.length) ), {
                    max: 1,
                    time: 30 * 1000,
                    errors: ['time']
                }
        );
        
        const response = responses.first();
        let embed;
        if(response.content.toLowerCase() === 'cancel' || parseInt(response.content) === 0) {
            message.client.awaitingUsers.delete(message.author.id);
            return dialog.edit('Selection cancelled.');
        }

        const responseIdx = parseInt(response.content) - 1;

        switch(true) {

            // --- Kamihimes
        
            case parseResult('Kamihime', result[responseIdx].objectType):
                embed = require('./Kamihime').run(message, config, result, responseIdx);
                break;
        
            // --- eidolons
        
            case parseResult('Eidolon', result[responseIdx].objectType):
                embed = require('./Eidolon').run(message, config, result, responseIdx);
                break;
        
            // --- Souls
        
            case parseResult('Soul', result[responseIdx].objectType):
                embed = require('./Soul').run(message, config, result, responseIdx);
                break;
        
            // --- Weapons
        
            case parseResult('Weapon', result[responseIdx].objectType):
                embed = require('./Weapon').run(message, config, result, responseIdx);
                break;
        
            // --- Accessories
        
            case parseResult('Accessory', result[responseIdx].objectType):
                embed = require('./Accessory').run(message, config, result, responseIdx);
                break;
        }

        if (message.channel.type === 'text' && message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES')) response.delete();
        dialog.edit({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));
    }
    catch (c) {
        if (typeof c.stack !== 'undefined') {
            dialog.edit(
                `Sorry, something happened: \`${err.message}\`\n\n`
                + `If this is a feature-breaking issue, please contact: `
                + `${config.owners ? config.owners.map(o => `\`${client.users.get(o).tag}\``).join(', ') : 'No bot developers were in the configuration'}\n`
                + `Or proceed to this Discord invite code: \`${config.discord_code ? config.discord_code : 'No invite code was in the configuration'}\``
              );
            message.client.logger.error(err);
        }
        else
            dialog.edit('Selection expired.');
    }
  message.client.awaitingUsers.delete(message.author.id);
};