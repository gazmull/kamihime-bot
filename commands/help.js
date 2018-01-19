// The usual help command
// Display a Welcome text and all the avaialable commands

const config    = require("../config.json");

exports.run = (client, message, args) => {

  let helpText = "\n";

  switch (args[0]) {

    case "kh":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"kh [name] | "+config.prefix+"kh \"[name]\" [parameter]\n\n";
    helpText    += "Displays info about a specific in-game character, weapon or accessory.\n(Example: "+config.prefix+"kh apep or "+config.prefix+"kh \"masamune\" soul)\n\n";
    helpText    += "#Tips\n";
    helpText    += "Fuzzy logic is applied to [name], it will try to match incomplete or misspelled inputs. (Exemple: "+config.prefix+"kh ytaga => displays Yatagarasu)\n";
    helpText    += "You can click the name field in the datasheet response to visit the related wiki page.\n";
    helpText    += "\n";
    helpText    += "#Anti-spam-advice\n";
    helpText    += "Using this command can be very intrusive in text channels.\n";
    helpText    += "For personal use only, we recommend you to contact the bot by direct message, and use the kh command there.\n";
    helpText    += "```*_\n";
    break;

    case "latest":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"latest\n\n";
    helpText    += "Displays the 15 latest objects downloaded or updated from the kamihime-project wikia website.\n";
    helpText    += "This command also displays the total number of object registered in the bot database.\n";
    helpText    += "```*_\n";
    break;

    case "countdown":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"countdown\n\n";
    helpText    += "Displays countdowns related to kamihime in-game events.\n";
    helpText    += "Includes Special events & some regular events.\n";
    helpText    += "```*_\n";
    break;

    case "invitebot":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"invitebot\n\n";
    helpText    += "Provides a link to install this bot on your own Discord server.\n";
    helpText    += "Please, ensure you have the 'Manage server' role on your discord server to allow installation of a bot.\n";
    helpText    += "```*_\n";
    break;

    case "kp":
    helpText    += "*```md\n";
    helpText    += "#Profile Display commands:\n\n";
    helpText    += config.prefix+"kp => Display your user profile.\n";
    helpText    += config.prefix+"kp @username => Display a user profile. (Only supported in text channels, not in direct messages)\n\n";
    helpText    += "#Profile Edition commands:\n";
    helpText    += "#Using edition commands in text channels is considered as spam, and will be redirected to direct messages with the bot.\n\n";
    helpText    += config.prefix+"kp set desc [text] => Edit description profile. (512 characters & 15 lines max / shift+enter for multi-lines description)\n";
    helpText    += config.prefix+"kp set gid [playerid] => Edit your in-game player id.\n";
    helpText    += config.prefix+"kp set country [2 letters country code] => Edit your country & timezone.\n";
    helpText    += config.prefix+"kp set lang [text] => Edit languages you can use on Discord.\n";
    helpText    += config.prefix+"kp set level [level] => Edit your in-game level.\n";
    helpText    += config.prefix+"kp set fav [CharacterName] => Edit your favorite character.\n";
    helpText    += "```*\n";
    break;

    case "kudos":
    helpText    += "*```md\n";
    helpText    += config.prefix+"kudos @username\n\n";
    helpText    += "Send one kudos point to a user. (Only supported in text channels, not in direct messages)\n";
    helpText    += "Only one kudos can be sent every 24 hours.\n";
    helpText    += "```*\n";
    break;


    default:
    helpText    += "__***kamihime-Bot:***__\n";
    helpText    += "\n";
    helpText    += "*A discord bot for the kamihime game from nutaku.net*\n";
    helpText    += "*All database information courtesy of kamihime-project.wikia.com*\n";
    helpText    += "\n";
    helpText    += "__*Special Credits:*__ Xkpaulo &  AzureSkye from kamihime-project.wikia.com\n\n";

    helpText    += "```css\n";
    helpText    += "#Bot-command-list:\n\n";
    helpText    += "Type '"+config.prefix+"help' for a general help message or '"+config.prefix+"help [command]' to get more info on a specific command. ( Example: "+config.prefix+"help kh )\n\n";
    helpText    += "[kh] - Displays info about a specific in-game character, weapon or accessory.\n";
    helpText    += "[countdown] - Displays countdowns related to in-game events.\n";
    helpText    += "[latest] - Displays the 15 latest objects downloaded from the wiki website.\n";
    helpText    += "[kp] - Displays or updates member profiles\n";
    helpText    += "[kudos] - Send a Kudos point to someone.\n";
    helpText    += "[invitebot] - Provides a link to install this bot on your own Discord server.\n\n";
    helpText    += "Don't include the example brackets when using commands!\n";
    helpText    += "```\n";

    helpText    += "```css\n";
    helpText    += "#Anti-spam-advice:\n\n";
    helpText    += "Using this bot on text channels can be very intrusive, please try to limit spam.\n";
    helpText    += "For a stricly personal use, we recommend you to contact the bot by direct messages, and send commands there.\n";
    helpText    += "```\n";

    break;

  }


  message.channel.send(helpText);
}
