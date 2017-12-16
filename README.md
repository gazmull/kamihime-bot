# kamihime-bot

A simple Kamihime Discord bot.  
* Displays datasheet infos from Kamihime, eidolons, souls and weapons.
* Displays countdowns related to game events.
* An optional quiz game.

### List of commands:

**/kh [name]**  
Displays information about the queried kamihime/soul/eidolon/weapon.

**/latest**    
Displays the 15 latest items downloaded from the wiki website.

**/invitebot**   
Provides a link to install this bot on your own discord server.

**/countdown**  
Displays the list game event countdowns.

**/countdown test DATE**  
(Restricted to specific roles & servers)  
Displays a countdown to *DATE* without saving it. Use this to test your *DATE* formatting without repeatedly adding and removing countdowns.

**/countdown add NAME DATE**  
(Restricted to specific roles & servers)  
Adds a countdown to the given *DATE* and saves it as *NAME*.

**/countdown remove NAME**  
(Restricted to specific roles & servers)  
Removes the countdown that matches the *NAME*.

**/countdown format**  
(Restricted to specific roles & servers)  
Displays a message to help understanding *DATE* formatting.

### Configuration:

Copy "*config.sample.json*" to "*config.json*" and edit your configuration file:


__token:__  
Token of your app, visit https://discordapp.com/developers/docs/intro to get yours.

__prefix:__  
Your discord prefix command.

__wikidomain:__  
Wiki domain to link each character page.

__thumbrooturl:__  
Root url of the kimihime image library. (used to display character images)

__eimojis:__  
Due to limited embed customization, server eimojis are used to display custom icons.  
On your discord server, add the custom eimojis available in /datas/eimoji using shortcuts provided in the config.sample.json file.  
On discord, use the command \\:K_myeimojishortcut: (example: \\:K_SSR:) to get your personal eimojis codes. Report resulting Ids to your config.json file.

__node_persist_path:__  
Relative path to local folder that will store persistent data.

__countdown_authorized_roles:__  
List of role names allowed to use sensible countdown commands.

__countdown_authorized_servers:__  
List of server id allowed to use sensible countdown commands.

__quiz__:  (optional quiz game)
* __channel_id:__  Channel Id which will be used for the quiz game. Leave it empty, if you don't want to install the game.
* __thumbrootencryptedurl:__  To prevent cheating in the quiz game, image url can be obfuscated.

__secret_key:__  (optional encryption)  
32 characters password for string encryption.  
Optionnaly used by the quiz game for image url encryption to avoid cheating.  
If activated, you will need to provide yourself a AES-256-CBC decryption feature on your image server.

__twitter:__  (optional twitter feeds)
* __consumer_key__: Twitter consumer_key
* __consumer_secret__: Twitter consumer secret
* __token_key__:   Twitter token key
* __token_secret__: Twitter token secret
* __streams__: List of twitter streams (including twitter_user_id and discord_channel)
