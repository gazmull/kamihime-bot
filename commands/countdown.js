
const Discord     = require("discord.js");
const _           = require("lodash");            // https://lodash.com
const Countdown   = require("countdown");         // http://countdownjs.org
const Moment      = require("moment-timezone");            // https://momentjs.com/
const persist     = require("../utils/persist").persist;
const config      = require("../config.json");
const logger      = require("../utils/logger").logger;

/*
 * These, unlike custom countdowns added with the command, are in Pacific time
 * to sync up with timezone changes for the game.
 */
const hardcoded_countdowns = [
  {
    name: 'Daily reset',
    time: '0:00',
    dayofweek: '*',
  },
  {
    name: 'Weapon/Eidolon Enhancement Quest1',
    time: '12:00',
    dayofweek: '*',
  },
  {
    name: 'Weapon/Eidolon Enhancement Quest2',
    time: '19:00',
    dayofweek: '*',
  },
  {
    name: 'Weapon/Eidolon Enhancement Quest3',
    time: '22:00',
    dayofweek: '*',
  },
  /*{
    name: 'Quest reset',
    time: '5:00',
    dayofweek: '*',
  },
  {
    name: 'Gem Quest1',
    time: '19:30',
    dayofweek: 'Friday',
  },
  {
    name: 'Gem Quest2',
    time: '23:30',
    dayofweek: 'Friday',
  },
  {
    name: 'Gem Quest3',
    time: '12:00',
    dayofweek: 'Saturday',
  },
  {
    name: 'Gem Quest4',
    time: '18:00',
    dayofweek: 'Saturday',
  },
  {
    name: 'Gem Quest5',
    time: '22:00',
    dayofweek: 'Saturday',
  },
  {
    name: 'Gem Quest6',
    time: '12:30',
    dayofweek: 'Sunday',
  },
  {
    name: 'Gem Quest7',
    time: '19:00',
    dayofweek: 'Sunday',
  },
  {
    name: 'Gem Quest8',
    time: '23:00',
    dayofweek: 'Sunday',
  }*/
];

const Countdown_units = Countdown.YEARS |
  Countdown.MONTHS |
  Countdown.DAYS |
  Countdown.HOURS |
  Countdown.MINUTES;

function get_countdowns_with_cleanup(callback) {
  persist.get('countdowns').then((countdowns) => {
    var needs_saving = false;

    for(var countdown_key in countdowns) {
      var date = Moment.utc(countdowns[countdown_key]).seconds(0);
      if(Moment.utc().isAfter(date)) {
        logger.info(`Countdown ` + countdown_key + ` points to the past. Removing...`);
        delete countdowns[countdown_key];
        needs_saving = true;
      }
    }

    if(needs_saving) {
      persist.set('countdowns', countdowns);
    }

    callback(countdowns);
  });
}

exports.run = (client, message, args) => {

  if (args.length === 0) {
    // /countdown ——— Print countdowns to next daily reset, quest reset and custom added dates.

    var countdown_array = [];

    for (var hardcoded_countdown_key in hardcoded_countdowns) {
      var definition = hardcoded_countdowns[hardcoded_countdown_key];
      var date = Moment.tz(definition.time, 'HH:mm', 'America/Los_Angeles').seconds(0);
      var day = Moment().format('dddd');
      if( (definition.dayofweek=="*") && (Moment.tz('America/Los_Angeles').isAfter(date)) ) {
        date.add(1, 'day');
      }
      if ( (definition.dayofweek=="*" || (day == definition.dayofweek))) {
        countdown_array.push([definition.name, date]);
      }
    }

    get_countdowns_with_cleanup((countdowns) => {
      for (var countdown_key in countdowns) {
        var date = Moment.utc(countdowns[countdown_key]).seconds(0);
        countdown_array.push([countdown_key, date]);
      }

      const embed = new Discord.RichEmbed()
      .setColor("#00AE86");

      var sorted_countdown_array = _.sortBy(countdown_array, (c) => { return c[1]; });
      for (var countdown_definition in sorted_countdown_array) {
        var [name, date] = sorted_countdown_array[countdown_definition];
        embed.addField(name, `in ` + Countdown(date, undefined, Countdown_units).toString());
      }

      message.channel.send({embed}).then(sentMessage => client.clearDialog(message, sentMessage));
    });

  } else if (args.length > 0) {

    if(!config.countdown_authorized_users.includes(message.author.id))
      return message.reply("Sorry, you don't have permissions to use this!");

    if (args[0] === "test") {
      // /countdown test DATE ——— Prints a countdown to the provided DATE without storing it.

      var date = Moment.utc(args[1]).seconds(0);
      message.channel.send(`Provided DATE is in ` + Countdown(date, undefined, Countdown_units).toString());

    } else if (args[0] === "add") {
      // /countdown add NAME DATE ——— Stores a DATE with an associated NAME for printing.
      args.shift();
      var date = args.pop();
      var name = args.join(" ");

      get_countdowns_with_cleanup((countdowns) => {
        countdowns[name] = date;
        persist.set('countdowns', countdowns).then(() => {
          message.channel.send(`Countdown added`);
        })
      });

    } else if (args[0] === "remove") {
      // /countdown remove NAME ——— Removes a date that matches NAME from printing.

      args.shift();
      var name = args.join(" ");

      get_countdowns_with_cleanup((countdowns) => {
        if(name in countdowns) {
          delete countdowns[name];
          persist.set('countdowns', countdowns).then(() => {
            message.channel.send(`Countdown removed`);
          })
        } else {
          message.channel.send(`Countdown not found`);
        }
      });

    } else if (args[0] === "format") {
      // countdown format ——— Displays a message to help understanding DATE formatting.

      const embed = new Discord.RichEmbed()
      .setColor("#00AE86")
      .addField('Format', `[year]-[month]-[day]T[hour]:[minute]`)
      .addField('Example', Moment.utc().format('Y-MM-DDTHH:mm') + ` would create a countdown to now.`)
      .addField('Note', `Date has to be provided in UTC. https://time.is/UTC`);

      message.channel.send({embed}).then(sentMessage => client.clearDialog(message, sentMessage));
    }
  }
}
