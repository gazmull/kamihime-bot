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
  let khRequest = args.join(' ');
  let khParameter = null;

  // --- RegExp for e.g. "-a" or "--accessory"
  const khRegExp = /\-{1}[a-zA-Z]|\-{2}[a-zA-Z]+/g;

  if(khRegExp.test(khRequest)) {
    const khMatch  = args.join(' ').match(khRegExp);
    const khIndex  = args.indexOf(khMatch[0]);
    khRequest = khIndex === 0 ? args.slice(1).join(' ') : args.slice(0, -1).join(' ');
    khParameter = args.slice(khIndex, khIndex + 1).toString().replace(/\-/g, '').toTitleCase();

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
      return message.channel.send('Invalid parameter.');
  }

  // --- Added condition where character names only has two characters

  if (khParameter) {
    if (!(shortNames.some( el => new RegExp(khRequest, 'i').test(el.name) && khParameter === el.objectType ) ||
        shortNames.some( el => el.name === khRequest.toTitleCase() && khParameter === el.objectType )) &&
        khRequest.length < 3)
      return message.channel.send('For the search query to be effective, you must enter at least three characters.');
  }

  else if (!khParameter) {
    if (!(shortNames.some( el => new RegExp(`\${khRequest}`, 'i').test(el.name) ) ||
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
    if (!(shortNames.some( el => new RegExp(khRequest, 'i').test(el.name) && khParameter === el.objectType ) ||
      shortNames.some( el => el.name === khRequest.toTitleCase() && khParameter === el.objectType )) &&
      parameterResults.length > 5)
    return message.channel.send(
      `The following items match with query '${khRequest}'${khParameter ? ` and parameter '${khParameter}'` : ''}:`
      +`\n\`\`\`js\n{\n${
        parameterResults.length > 7
          ? `${parameterResults.slice(0, 6).map(el =>  `\t${el.objectType}: "${el.name}"`).join(',\n')},\n\tFurther: "Results..."`
          : parameterResults.map(el => `\t${el.objectType}: "${el.name}"`).join(',\n')
        }\n}\`\`\``
      +`\nPlease be more specific with the search query.`
    );
  }

   else if (!khParameter) {
    if (!(shortNames.some( el => new RegExp(khRequest, 'i').test(el.name) ) ||
      shortNames.some( el => el.name === khRequest.toTitleCase() )) &&
      parameterResults.length > 5)
    return message.channel.send(
      `The following items match with query '${khRequest}':`
      +`\n\`\`\`js\n{\n${
        parameterResults.length > 7
          ? `${parameterResults.slice(0, 6).map(el =>  `\t${el.objectType}: "${el.name}"`).join(',\n')},\n\tFurther: "Results..."`
          : parameterResults.map(el => `\t${el.objectType}: "${el.name}"`).join(',\n')
        }\n}\`\`\``
      +`\nPlease be more specific with the search query.`
    );
   }

  // --- Condition check from parseResult() for Kamihimes, Eidolons, Souls, Weapons, and Accessories
  
  switch(true) {

    // --- Kamihimes

    case parseResult('Kamihime', parameterResults[0].objectType, khParameter):
      require('../utils/khEmbeds/Kamihime').run(message, config, parameterResults, 0);
      break;

    // --- eidolons

    case parseResult('Eidolon', parameterResults[0].objectType, khParameter):
      require('../utils/khEmbeds/Eidolon').run(message, config, parameterResults, 0);
      break;

    // --- Souls

    case parseResult('Soul', parameterResults[0].objectType, khParameter):
      require('../utils/khEmbeds/Soul').run(message, config, parameterResults, 0);
      break;

    // --- Weapons

    case parseResult('Weapon', parameterResults[0].objectType, khParameter):
      require('../utils/khEmbeds/Weapon').run(message, config, parameterResults, 0);
      break;

    // --- Accessories

    case parseResult('Accessory', parameterResults[0].objectType, khParameter):
      require('../utils/khEmbeds/Accessory').run(message, config, parameterResults, 0);
      break;
  }
}
