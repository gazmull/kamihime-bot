// The usual help command
// Display a Welcome text and all the avaialable commands

exports.run = (client, message, args) => {
  const query = args.join(" ");

  var welcomeText = "\n";
  welcomeText    += "__***kamihime-Bot:***__\n";
  welcomeText    += "\n";
  welcomeText    += "*A discord bot for the kamihime game from nutaku.net*\n";
  welcomeText    += "*All database information courtesy of kamihime-project.wikia.com*\n";
  welcomeText    += "\n";
  welcomeText    += "__*Special Credits:*__ Xkpaulo &  AzureSkye601 from kamihime-project.wikia.com\n\n";
  welcomeText    += "_*```css\n";
  welcomeText    += "#Kamihime-Bot-command-list:\n";
  welcomeText    += "/kh [name]";
  welcomeText    += " => Displays info about a specific in-game character or weapon.\n";
  welcomeText    += "/latest";
  welcomeText    += " => Displays the 15 latest objects downloaded from the wiki website.\n";
  welcomeText    += "/countdown";
  welcomeText    += " => Displays countdowns related to in-game events.\n";
  welcomeText    += "/invitebot";
  welcomeText    += " => Provides a link to install this bot on your own discord server.\n";  
  welcomeText    += "\n";
  welcomeText    += "#tips\n";
  welcomeText    += "Fuzzy logic is applied to [name], it will try to match incomplete or misspelled inputs.\n";
  welcomeText    += "You can click the name field in the datasheet response to visit the related wiki page. \n";
  welcomeText    += "```*_\n";

  message.channel.send(welcomeText);
}
