// The usual help command
// Display a Welcome text and all the avaialable commands

exports.run = (client, message, args) => {
  const query = args.join(" ");

  var welcomeText = "__***Kamihime Discord Bot:***__\n";
  welcomeText    += "*Some text here*";

  message.channel.send(welcomeText);
}
