
const Countdown   = require("countdown");         // http://countdownjs.org
const Moment      = require("moment");            // https://momentjs.com/

exports.run = (client, message, args) => {
  var nextDailyReset = Moment.utc().hour(7).minute(0).second(0);
  if(Moment.utc().isAfter(nextDailyReset)) { nextDailyReset.add(1, 'day'); }
  message.channel.send(`Daily reset is in ` + Countdown(nextDailyReset).toString());
}
