const Twit = require('twit');
const Helper = require('../Helper');

class TwitterFunctionHelper extends Helper {
  init() {
    const {
      client,
      util: { collection, embed, config }
    } = this;

    if (!config.twitter) return Promise.reject(new Error('Twitter Configuration not found.'));

    const {
      twitter: {
        consumer_key,
        consumer_secret,
        token_key: access_token,
        token_secret: access_token_secret,
        streams: cfgStreams
      }
    } = config;

    client.twitter = {
      streams: collection()
      // streamNames: collection()
    };
    const { streams } = client.twitter;

    for (const stream of Object.keys(cfgStreams))
      streams.set(stream, cfgStreams[stream]);

    const twitter = new Twit({
      consumer_key,
      consumer_secret,
      access_token,
      access_token_secret
    });
    const stream = twitter.stream('statuses/filter', { follow: Array.from(streams.keys()) });

    stream
      .on('tweet', async tweet => {
        if (tweet.retweeted_status || tweet.in_reply_to_user_id_str)
          return;

        let temp = await client.db.execute('SELECT `union_discord_guild_id`, `union_discord_twitter_channel_id` FROM `unions` WHERE `union_discord_twitter_channel_id` IS NOT NULL');
        const guilds = temp;
        const tweeted = embed()
          .setColor(0x00AE86)
          .setTimestamp(new Date())
          .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})`)
          .setURL(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
          .setThumbnail(tweet.user.profile_image_url)
          .setDescription(tweet.text);

        if (tweet.entities.media)
          embed.setImage(tweet.entities.media[0].media_url);

        const user = client.setInterval(() => {
          let currentStream = streams.keys().next().value;

          if (!currentStream) return client.clearInterval(user);

          const cooldown = client.setInterval(() => {
            if (!temp.length) {
              if (!streams.size) return client.clearInterval(cooldown);

              streams.delete(currentStream);

              currentStream = streams.keys().next().value;
              temp = guilds;
            }

            const concatTemp = temp.splice(0, 3);

            for (const guild of concatTemp) {
              const resolvedChannel = client.channels.get(guild.union_discord_twitter_channel_id);

              if (!resolvedChannel) continue;

              resolvedChannel.send(tweeted);
            }
          }, 3000);
        }, 5000);
      })
      .on('connect', () => this.logger('info', 'Connecting to Twitter API...'))
      .on('connected', () => this.logger('info', 'Connected to Twitter API'))
      .on('disconnect', () => this.logger('info', 'Disconnected from Twitter API'))
      .on('warning', warning => this.logger('warn', warning))
      .on('error', error => this.logger('error', error));

    return Promise.resolve(true);
  }
}

module.exports = TwitterFunctionHelper;
