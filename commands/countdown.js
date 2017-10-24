
const Discord     = require("discord.js");
const _           = require("lodash");            // https://lodash.com
const Countdown   = require("countdown");         // http://countdownjs.org
const Moment      = require("moment");            // https://momentjs.com/
const persist     = require("../datas/persist").persist;

const hardcoded_countdowns = [
  {
    name: 'Daily reset',
    time: '7:00',
  },
  {
    name: 'First Burst Time',
    time: '11:00',
  },
  {
    name: 'Quest reset',
    time: '12:00',
  },
  {
    name: 'Second Burst Time',
    time: '19:00',
  }
];

const Countdown_units = Countdown.YEARS |
  Countdown.MONTHS |
  Countdown.DAYS |
  Countdown.HOURS |
  Countdown.MINUTES;

exports.run = (client, message, args) => {
  
  if (args.length === 0) {
    // /countdown ——— Print countdowns to next daily reset, quest reset and custom added dates.

    var countdown_array = [];
    
    for (var hardcoded_countdown_key in hardcoded_countdowns) {
      var definition = hardcoded_countdowns[hardcoded_countdown_key];
      var date = Moment.utc(definition.time, 'HH:mm').seconds(0);
      if(Moment.utc().isAfter(date)) { date.add(1, 'day'); }
      countdown_array.push([definition.name, date]);
    }
    
    persist.get('countdowns').then((countdowns) => {
      for (var countdown_key in countdowns) {
        countdown_array.push([countdown_key, Moment.utc(countdowns[countdown_key]).seconds(0)]);
      }
      
      const embed = new Discord.RichEmbed()
      .setColor("#00AE86");
      
      var sorted_countdown_array = _.sortBy(countdown_array, (c) => { return c[1]; });
      for (var countdown_definition in sorted_countdown_array) {
        var [name, date] = sorted_countdown_array[countdown_definition];
        embed.addField(name, `in ` + Countdown(date, undefined, Countdown_units).toString());
      }
      
      message.channel.send({embed});
    });
    
  } else if (args.length > 0) {
    
    if (args[0] === "test") {
      // /countdown test DATE ——— Prints a countdown to the provided DATE without storing it.
      
      var date = Moment.utc(args[1]).seconds(0);
      message.channel.send(`Provided DATE is in ` + Countdown(date, undefined, Countdown_units).toString());
      
    } else if (args[0] === "add") {
      // /countdown add NAME DATE ——— Stores a DATE with an associated NAME for printing.
      args.shift();
      var date = args.pop();
      var name = args.join(" ");
      
      persist.get('countdowns').then((countdowns) => {
        countdowns[name] = date;
        persist.set('countdowns', countdowns).then(() => {
          message.channel.send(`Countdown added`);
        })
      });
      
    } else if (args[0] === "remove") {
      // /countdown remove NAME ——— Removes a date that matches NAME from printing.
      
      args.shift();
      var name = args.join(" ");
      
      persist.get('countdowns').then((countdowns) => {
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
      
      message.channel.send({embed});
    }
  }
}
