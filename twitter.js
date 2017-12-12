
//const Discord = require("discord.js");
const config  = require("./config.json");
const _       = require('lodash');
const Twit    = require('twit')

var streams       = {};
var streamNames   = {};

// -----------

exports.init = (client) => {

  if (!config.hasOwnProperty('twitter')) return;

  // Twitter configuration

  const twitter = new Twit({
    consumer_key: config.twitter['consumer_key'],
    consumer_secret: config.twitter['consumer_secret'],
    access_token: config.twitter['token_key'],
    access_token_secret: config.twitter['token_secret']
  })

  _.each(config.twitter.streams, (stream, streamName) => {
      streams[stream['twitter_id']] = stream['discord_channel_id'];
      streamNames[stream['twitter_id']] = streamName;
      //console.log(`Creating stream '${streamName}':\t${stream['twitter_id']} ===> ${stream['discord_channel_id']}`);
  })

  // Stream configuration
  let stream = twitter.stream('statuses/filter', {follow: _.keys(streams)});
  stream.on('tweet', (tweet) => {
      // fixme: optionally stream retweets and/or favorites
      if (tweet.hasOwnProperty('retweeted_status')) return;
      if (tweet.hasOwnProperty('in_reply_to_user_id_str')) {
        if (tweet.in_reply_to_user_id_str) return;
      }
      //console.log(`Event on stream '${streamNames[tweet.user['id_str']]}'`)
      //console.log(`Received tweet: ${tweet.text}`);
      //console.log(tweet);
      client.channels.find('id', streams[tweet.user['id_str']]).send(tweet.text);
  })

  stream.on('connect', (request) => {
      //console.log(`Client connecting: twitter`);
  })
  stream.on('connected', (response) => {
      //console.log('Client ready: twitter');
  })
  stream.on('disconnect', (disconnectMessage) => {
      //console.log(`Received a disconnect message from twitter: ${disconnectMessage}`);
  })
  stream.on('reconnect', (request, response, connectInterval) => {
      //console.log('Reconnection attempt to twitter is scheduled');
  })
  stream.on('warning', (warning) => { console.log(warning) });
  stream.on('error', (error) => { throw error });

}
