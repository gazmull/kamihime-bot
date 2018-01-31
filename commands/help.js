// The usual help command
// Display a Welcome text and all the avaialable commands

const config    = require("../config.json");

exports.run = (client, message, args) => {

  let helpText = "\n";

  switch (args[0]) {

    case "kh":
    helpText    += "_*```css\n";
    helpText    += config.prefix+"kh [name] | "+config.prefix+"kh [name] [parameter] | "+config.prefix+"kh [parameter] [name]\n\n";
    helpText    += "Displays info about a specific in-game character, weapon or accessory.\n(Example: "+config.prefix+"kh masamune, "+config.prefix+"kh masamune --soul or "+config.prefix+"kh --soul masamune)\n\n";
    helpText    += "#Available-Parameters\n";
    helpText    += "[-k], [--kamihime]    Search by Kamihime\n";
    helpText    += "[-e], [--eidolon]     Search by Eidolon\n";
    helpText    += "[-s], [--soul]        Search by Soul\n";
    helpText    += "[-w], [--weapon]      Search by Weapon\n";
    helpText    += "[-a], [--accessory]   Search by Accessory\n";
    helpText    += "\n";
    helpText    += "#Tips\n";
    helpText    += "Fuzzy logic is applied to [name], it will try to match incomplete or misspelled inputs. (Exemple: "+config.prefix+"kh ytaga => displays Yatagarasu)\n";
    helpText    += "Having a parameter will give you better result when looking for a specific item.\n"
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

    case "ku":
    helpText    += "*```md\n";
    helpText    += "#Union Display commands:\n\n";

    helpText    += config.prefix+"ku => display information about your union\n";
    helpText    += config.prefix+"ku [@username] => display union info about a specific user\n";
    helpText    += config.prefix+"ku [name] => display information about a specific union\n";
    helpText    += config.prefix+"ku list [pageNumber] => display the list of registered unions\n\n";

    helpText    += "#Command restricted to Discord server owner\n\n";
    helpText    += config.prefix+"ku new [name] => register your union on Discord and affect you as Leader of this union\n";
    helpText    += config.prefix+"ku role subleader [discordrolename] => all discord members with the role [discordrolename] will be affected to your union as SubLeaders\n";
    helpText    += config.prefix+"ku role officer [discordrolename] => all discord members with the role [discordrolename] will be affected to your union as Officers\n";
    helpText    += config.prefix+"ku role member [discordrolename] => all discord members with the role [discordrolename] will be affected to your union as Members\n\n";

    helpText    += "#Command restricted to users having the role subleader/leader]\n\n";
    helpText    += config.prefix+"ku set name [text] => Update your union name\n";
    helpText    += config.prefix+"ku set nbmembers [number] => Set the real number of players in your Union (useful to count non discord union players)\n";
    helpText    += config.prefix+"ku set desc [text] => Set description text for your union\n";
    helpText    += config.prefix+"ku set bursttime => Set Union BurstTime\n";
    helpText    += config.prefix+"ku set recruit [on/off] => Activate/Deactivate recruitment\n";
    helpText    += config.prefix+"ku set recruitdesc [text] => Set Text for your recruitment campaign (the text is displayed only if recruitment is on)\n";
    helpText    += config.prefix+"ku set timezone => Set favorite Timezone for gathering\n";
    helpText    += config.prefix+"ku set discordinvit [link] => link to your discord server\n";
    helpText    += config.prefix+"ku set private [on/off] => Exclude the union from the public union list & recruitment (default off)\n\n";

    helpText    += "Once roles are configured, the bot will automatically update the union Memberlist regarding discord member status.\n";
    helpText    += "The profile field 'UnionName PlaceHolder [coming soon]' will also be replaced by your Union name and role (subleader/leader)\n\n";
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
    helpText    += "Type '"+config.prefix+"help' for this general help message or '"+config.prefix+"help [command]' to get more info on a specific command. ( Example: "+config.prefix+"help kh )\n\n";
    helpText    += "[kh] - Displays info about a specific in-game character, weapon or accessory.\n";
    helpText    += "[countdown] - Displays countdowns related to in-game events.\n";
    helpText    += "[latest] - Displays the 15 latest objects downloaded from the wiki website.\n";
    helpText    += "[kp] - Displays or updates member profiles\n";
    helpText    += "[ku] - Displays or updates union profiles\n";
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


  message.channel.send(helpText).then(sentMessage => client.clearDialog(message, sentMessage));
}
