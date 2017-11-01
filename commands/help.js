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
  welcomeText    += "```Markdown\n";
  welcomeText    += "#List of commands:\n";
  welcomeText    += "\n";
  welcomeText    += "/kh [Kamihime/Eidolon/Soul/Weapon name]\n";
  welcomeText    += "Displays information about your favorite character or weapon.\n";
  welcomeText    += "\n";
  welcomeText    += "/countdown\n";
  welcomeText    += "Displays the list of hardcoded and custom countdowns.\n";
  welcomeText    += "\n";
  welcomeText    += "/countdown test DATE\n";
  welcomeText    += "Displays a countdown to DATE without saving it. Use this to test your DATE formatting without repeatedly adding and removing countdowns.\n";
  welcomeText    += "\n";
  welcomeText    += "/countdown add EVENT_NAME DATE\n";
  welcomeText    += "Adds a countdown to the given DATE and saves it as EVENT_NAME.\n";
  welcomeText    += "\n";
  welcomeText    += "/countdown remove EVENT_NAME\n";
  welcomeText    += "Removes the countdown that matches the EVENT_NAME.\n";
  welcomeText    += "\n";
  welcomeText    += "/countdown format\n";
  welcomeText    += "Displays a message to help understanding DATE formatting.\n";
  welcomeText    += "```\n";

  message.channel.send(welcomeText);
}
