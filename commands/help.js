// The usual help command
// Display a Welcome text and all the avaialable commands

const config    = require("../config.json");

exports.run = (client, message, args) => {

  let helpText = "\n";

  switch (args[0]) {

    case "kh":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"kh [name]";
    helpText    += " => Displays info about a specific in-game character, weapon or accessory.\n\n";
    helpText    += "Fuzzy logic is applied to [name], it will try to match incomplete or misspelled inputs. (Exemple: "+config.prefix+"kh ytaga -> displays Yatagarasu)\n";
    helpText    += "You can click the name field in the datasheet response to visit the related wiki page.\n\n";
    helpText    += "```*_\n";
    break;

    case "latest":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"latest";
    helpText    += " => Displays the 15 latest objects downloaded from the wiki website.\n\n";
    helpText    += "The command also display the total number of object available in the database.\n";
    helpText    += "```*_\n";
    break;

    case "countdown":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"countdown";
    helpText    += " => Displays countdowns related to in-game events.\n\n";
    helpText    += "Special events & regular events.\n";
    helpText    += "```*_\n";
    break;

    case "invitebot":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"invitebot";
    helpText    += " => Provides a link to install this bot on your own discord server.\n";
    helpText    += "```*_\n";
    break;

    case "kp":
    helpText    += "*```\n";
    helpText    += config.prefix+"kp => Display your profile.\n";
    helpText    += config.prefix+"kp @username => Display a user profile. (Only supported in text channels, not in direct messages)\n\n";
    helpText    += config.prefix+"kp set desc [text] => Edit description profile. (512 characters and 15 lines max)\n";
    helpText    += config.prefix+"kp set gid [playerid] => Edit your in-game player id.\n";
    helpText    += config.prefix+"kp set country [2 letters country code] => Edit your country & timezone.\n";
    helpText    += config.prefix+"kp set lang [text] => Edit languages you can use on Discord.\n";
    helpText    += config.prefix+"kp set level [level] => Edit your in-game level.\n";
    helpText    += config.prefix+"kp set fav [CharacterName] => Edit your favorite character.\n";
    helpText    += "```*\n";
    break;

    default:
    helpText    += "__***kamihime-Bot:***__\n";
    helpText    += "\n";
    helpText    += "*A discord bot for the kamihime game from nutaku.net*\n";
    helpText    += "*All database information courtesy of kamihime-project.wikia.com*\n";
    helpText    += "\n";
    helpText    += "__*Special Credits:*__ Xkpaulo &  AzureSkye from kamihime-project.wikia.com\n\n";
    helpText    += "_*```css\n";
    helpText    += "#Standard-command-list:\n";
    helpText    += config.prefix+"kh [name]";
    helpText    += " => Displays info about a specific in-game character, weapon or accessory.\n";
    helpText    += config.prefix+"latest";
    helpText    += " => Displays the 15 latest objects downloaded from the wiki website.\n";
    helpText    += config.prefix+"countdown";
    helpText    += " => Displays countdowns related to in-game events.\n";
    helpText    += config.prefix+"invitebot";
    helpText    += " => Provides a link to install this bot on your own discord server.\n";
    helpText    += "\n";
    helpText    += "#tips\n";
    helpText    += "Fuzzy logic is applied to [name], it will try to match incomplete or misspelled inputs. (Exemple: "+config.prefix+"kh ytaga -> displays Yatagarasu)\n";
    helpText    += "You can click the name field in the datasheet response to visit the related wiki page.\n";
    helpText    += "```*_\n";
    break;

  }


  message.channel.send(helpText);
}
