const Twit = require('twit');
const Helper = require('../Helper');

class TwitterFunctionHelper extends Helper {
  init() {
    const {
      client,
      util: { collection, config }
    } = this;

    if (!config.hasOwnProperty('twitter')) return Promise.reject(new Error('Twitter Configuration not found.'));

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

    for (const stream of Object.keys(cfgStreams)) {
      const id = cfgStreams[stream];

      streams.set(id.twitter_id, id.discord_channel_id);
      // streamNames.set(id.twitter_id, stream);
    }

    const twitter = new Twit({
      consumer_key,
      consumer_secret,
      access_token,
      access_token_secret
    });
    const stream = twitter.stream('statuses/filter', { follow: Array.from(streams.keys()) });

    stream
      .on('tweet', tweet => {
        if (tweet.hasOwnProperty('retweeted_status')) return;
        else if (tweet.hasOwnProperty('in_reply_to_user_id_str') && tweet.in_reply_to_user_id_str) return;

        client.channels.get(streams.get(tweet.user.id_str)).send(`\u200B\n${tweet.text}`);
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
