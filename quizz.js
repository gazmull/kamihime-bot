
const Discord = require("discord.js");
const config  = require("./config.json");
const khinfos = require("./khinfos.js");

global.khquizz_goodResponse;

// -----------

exports.read_answer = (client, message) => {

 let response = parseInt(message) || 0;

 if ((response<1) || (response>4)) {
   return;
 }
 response--;

 if( response == khquizz_goodResponse ) {
   message.channel.send("correct answer.");
 }
 else {
   message.channel.send("Sorry, the answer is wrong.");
 }

  exports.init_question(client);
}

// -----------

exports.init_question = (client) => {
  var channel = client.channels.get(config.quizz_channel_id);

  const khArray       = khinfos.getKHInfos();
  const nbTotalItem   = khArray.length;
  const responses     = [];

  const itemId          = Math.floor(Math.random()*nbTotalItem);
  const itemName        = khArray[itemId].name;
  khquizz_goodResponse  = Math.floor(Math.random()*4);

  const encryptedUrl    = khinfos.encrypt(khArray[itemId].portraiturl);
  const itemThumb       = config.quizz_thumbrootencryptedurl+"/"+encryptedUrl;

  for (var i=0;i<4;i++)  {
    responses[i] = Math.floor(Math.random()*nbTotalItem);
  }
  responses[khquizz_goodResponse] = itemId;

  const embed = new Discord.RichEmbed()
  .setTitle("Who is this character?")
  .setAuthor("Kamihime Quizz: "+itemName)
  .setThumbnail(itemThumb)
  .setColor("#00AE86");
  var description = "1 - "+khArray[responses[0]].name+"\n";
  description += "2 - "+khArray[responses[1]].name+"\n";
  description += "3 - "+khArray[responses[2]].name+"\n";
  description += "4 - "+khArray[responses[3]].name+"\n";
  embed.setDescription(description);

  channel.send({embed});

}
