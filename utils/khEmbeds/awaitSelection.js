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
                ( m.content.toLowerCase() === 'cancel' ||
                ( parseInt(m.content) >= 1 && parseInt(m.content) <= result.length) ), {
                    max: 1,
                    time: 30 * 1000,
                    errors: ['time']
                }
        );
        
        const response = responses.first();
        let embed;
        if(response.content.toLowerCase() === 'cancel') {
            message.client.awaitingUsers.delete(message.author.id);
            return dialog.edit('Selection cancelled.');
        }

        const responseIdx = parseInt(response) - 1;

        switch(true) {

            // --- Kamihimes
        
            case parseResult('Kamihime', result[responseIdx].objectType):
                embed = require('./Kamihime').run(message, config, result, responseIdx);
                if(message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES')) response.delete();
                dialog.edit({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));
                break;
        
            // --- eidolons
        
            case parseResult('Eidolon', result[responseIdx].objectType):
                embed = require('./Eidolon').run(message, config, result, responseIdx);
                if(message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES')) response.delete();
                dialog.edit({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));
                break;
        
            // --- Souls
        
            case parseResult('Soul', result[responseIdx].objectType):
                embed = require('./Soul').run(message, config, result, responseIdx);
                if(message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES')) response.delete();
                dialog.edit({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));
                break;
        
            // --- Weapons
        
            case parseResult('Weapon', result[responseIdx].objectType):
                embed = require('./Weapon').run(message, config, result, responseIdx);
                if(message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES')) response.delete();
                dialog.edit({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));
                break;
        
            // --- Accessories
        
            case parseResult('Accessory', result[responseIdx].objectType):
                embed = require('./Accessory').run(message, config, result, responseIdx);
                if(message.channel.permissionsFor(message.client.user).has('MANAGE_MESSAGES')) response.delete();
                dialog.edit({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));
                break;
        }
    }
    catch (c) {
        dialog.edit('Selection expired.');
        typeof c.stack !== 'undefined' ? message.client.logger.error(c) : null;
    }
  message.client.awaitingUsers.delete(message.author.id);
};