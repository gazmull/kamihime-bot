# kamihime-bot

A simple Kamihime Discord bot. it supports Kamihime, eidolons and souls.

Use the command **/kh [character name]** to display kamihime infos.

### Configuration:

Copy "*config.sample.json*" to "*config.json*" and edit your configuration:


__token:__

Token of your app, visit https://discordapp.com/developers/docs/intro to get yours.

__prefix:__

Your discord prefix command.

__wikidomain:__

Wiki domain to link each character page.

__thumbrooturl:__

Root url of the kimihime image library. (mostly used to link character thumbs)

__eimojis:__

Due to limited embed customization, server eimojis are used to display some icons.

On your discord server, add the custom eimojis available in /datas/eimoji using shortcuts provided in the config.sample.json file.

On discord, use the command \:K_myeimojishortcut: (example: \:K_SSR:) to get your personal eimojis codes. Report resulting Ids to your config.json file.
