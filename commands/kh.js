// Return Simple Item datasheets.
// Currently supported items: Kamihimes Eidolons Souls & Weapons

const discord    = require('discord.js');
const config     = require('../config.json');
const khinfos    = require('../utils/khinfos.js');
const fuzzy      = require('fuzzy');
const khArray    = khinfos.getKHInfos();
const shortNames = require('../datas/shortNames');

const fuzzyOptions = {
  extract: function(el) { return el.name; }
};

// --- added for parameter feature
const objectTypes = {
  shortHands: [
    'K', // Kamihime
    'E', // Eidolon
    'S', // Soul
    'W', // Weapon
    'A'  // Accessory
  ],
  longHands: [
    'Kamihime',
    'Eidolon',
    'Soul',
    'Weapon',
    'Accessory'
  ]
};

// --- parses result; added due to checking for khParameter.
// --- from '/kh kagutsuchi' to '/kh "kagutsuchi" kamihime'
// --- parameter is optional but recommended (user)

const parseResult = (objectType, result, parameter) => {
  let returningResult;

  parameter === null
    ? returningResult = result == objectType
    : returningResult = result == objectType && parameter == objectType;

  return returningResult;
};

// -- Title case

String.prototype.toTitleCase = function () {
  return this[0].toUpperCase() + this.substring(1).toLowerCase();
};

// --- process the command

exports.run     = (client, message, args) => {

  if(message.guild) {
    if( !message.channel.permissionsFor(message.client.user).has('SEND_MESSAGES') ) {
      return;
    }
    if( !message.channel.permissionsFor(message.client.user).has('EMBED_LINKS') ) {
      message.channel.send("'Embed Links' permission had been deactivated for me in this channel, please update my permissions to allow a response.");
      return;
    }
  }

  if(client.awaitingUsers.get(message.author.id)) return message.channel.send(`You have an existing selection ongoing. Please say \`cancel\` or \`0\` if you wish to issue a new ${config.prefix}kh command.`);

  let khRequest = args.join(' ');
  let khParameter = null;

  if(!khRequest) {
    message.channel.send('For the search query to be effective, you must enter at least three characters.');
    return;
  }

  // --- RegExp for e.g. "-a" or "--accessory"
  const khRegExp = /(^| )\-{1,2}[a-zA-Z]+/g;

  if(khRegExp.test(khRequest)) {
    const khMatch  = args.join(' ').match(khRegExp);
    const khIndex  = args.indexOf((khMatch[0].toString()[0] === ' ' ? khMatch[0].toString().slice(1) : khMatch[0]));
    khRequest = khIndex === 0 ? args.slice(1).join(' ') : args.slice(0, khIndex).join(' ');
    khParameter =
      khIndex + 1 === args.length
        ? args.slice(1).toString().replace(/\-/g, '').toTitleCase()
        : args.slice(0, 1).toString().replace(/\-/g, '').toTitleCase();

    // --- Parse shortHand parameter to longHand parameter for comparison with objectType later

    switch(khParameter) {
      case 'K':
        khParameter = 'Kamihime';
        break;
      case 'E':
        khParameter = 'Eidolon';
        break;
      case 'S':
        khParameter = 'Soul';
        break;
      case 'W':
        khParameter = 'Weapon';
        break;
      case 'A':
        khParameter = 'Accessory';
        break;
      default: null;
    }

    if (!(objectTypes.shortHands.some(el => khParameter === el) || objectTypes.longHands.some(el => khParameter === el)))
      return message.channel.send(
        `Invalid parameter.\n`
        +`Proper usage: \`${config.prefix}kh [name]\` | \`${config.prefix}kh [name] [parameter]\` | \`${config.prefix}kh [parameter] [name]\``
      );
  }

  // --- Added condition where character names only has two characters

  const khRequestEscaped = khRequest.replace(/[\(\)]/g, '\\$&');

  if (khParameter) {
    if (!(shortNames.some( el => new RegExp(khRequestEscaped, 'i').test(el.name) && khParameter === el.objectType ) ||
        shortNames.some( el => el.name === khRequest.toTitleCase() && khParameter === el.objectType )) &&
        khRequest.length < 3)
      return message.channel.send('For the search query to be effective, you must enter at least three characters.');
  }

  else if (!khParameter) {
    if (!(shortNames.some( el => new RegExp(khRequestEscaped, 'i').test(el.name) ) ||
        shortNames.some( el => el.name === khRequest.toTitleCase() )) &&
        khRequest.length < 3)
      return message.channel.send('For the search query to be effective, you must enter at least three characters.');
  }

  const results = fuzzy.filter(khRequest, khArray, fuzzyOptions);
  const khItems = results.map(function(el) { return el.original; });
  const parameterResults = khParameter !== null ? khItems.filter(el => el.objectType == khParameter) : khItems;

  // --- Check for any results
  // --- If there is only 5 and below on results.length, we will continue and cherry pick first element of results
  // --- Otherewise, we will return with a map of matching items

  if (!parameterResults.length)
    return message.channel.send(`Query '${khRequest}'${khParameter ? ` with parameter '${khParameter}'` : ''} is not found.`);

  else if (khParameter) {
    if (!(shortNames.some( el => new RegExp(khRequestEscaped, 'i').test(el.name) && khParameter === el.objectType ) ||
      shortNames.some( el => el.name === khRequest.toTitleCase() && khParameter === el.objectType )) &&
      parameterResults.length > 1) {
      message.channel.send(
        `The following items match with query '${khRequest}'${khParameter ? ` and parameter '${khParameter}'` : ''}:`
        +`\n\`\`\`js\n{\n\t0_Void: "Cancel the Selection",\n${parameterResults.slice(0, 9).map(el => `\t${parameterResults.indexOf(el) + 1}_${el.objectType}: "${el.name}"`).join(',\n')}\n}\`\`\``
        +`\nSelect an item by their designated number to prompt me to continue. Say \`cancel\` or \`0\` to cancel the command.`
        +`\nExpires within 30 seconds.`
      ).then(sentMessage => {
        client.awaitSelection(message, sentMessage, parameterResults.slice(0, 9));
        client.awaitingUsers.set(message.author.id, true);
      });
      return;
    }
  }

   else if (!khParameter) {
    if (!(shortNames.some( el => new RegExp(khRequestEscaped, 'i').test(el.name) ) ||
      shortNames.some( el => el.name === khRequest.toTitleCase() )) &&
      parameterResults.length > 1) {
      message.channel.send(
        `The following items match with query '${khRequest}':`
        +`\n\`\`\`js\n{\n\t0_Void: "Cancel the Selection",\n${parameterResults.slice(0, 9).map(el => `\t${parameterResults.indexOf(el) + 1}_${el.objectType}: "${el.name}"`).join(',\n')}\n}\`\`\``
        +`\nSelect an item by their designated number to prompt me to continue. Say \`cancel\` or \`0\` to cancel the command.`
        +`\nExpires within 30 seconds.`
      ).then(sentMessage => {
        client.awaitSelection(message, sentMessage, parameterResults.slice(0, 9));
        client.awaitingUsers.set(message.author.id, true);
      });
      return;
    }
   }

  // --- Condition check from parseResult() for Kamihimes, Eidolons, Souls, Weapons, and Accessories

  let embed;

  switch(true) {

    // --- Kamihimes

    case parseResult('Kamihime', parameterResults[0].objectType, khParameter):
      embed = require('../utils/khEmbeds/Kamihime').run(message, config, parameterResults, 0);
      break;

    // --- eidolons

    case parseResult('Eidolon', parameterResults[0].objectType, khParameter):
      embed = require('../utils/khEmbeds/Eidolon').run(message, config, parameterResults, 0);
      break;

    // --- Souls

    case parseResult('Soul', parameterResults[0].objectType, khParameter):
      embed = require('../utils/khEmbeds/Soul').run(message, config, parameterResults, 0);
      break;

    // --- Weapons

    case parseResult('Weapon', parameterResults[0].objectType, khParameter):
      embed = require('../utils/khEmbeds/Weapon').run(message, config, parameterResults, 0);
      break;

    // --- Accessories

    case parseResult('Accessory', parameterResults[0].objectType, khParameter):
      embed = require('../utils/khEmbeds/Accessory').run(message, config, parameterResults, 0);
      break;
  }

  message.channel.send({embed}).then(sentMessage => message.client.clearDialog(message, sentMessage));
}
