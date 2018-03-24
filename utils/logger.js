const winston = require('winston');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const logDir = 'datas/logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir))
  fs.mkdirSync(logDir);

const tsFormat = () => new Date().toLocaleTimeString();

module.exports = new (winston.Logger)({
  transports: [

    // Colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),

    new (require('winston-daily-rotate-file'))({ // eslint-disable-line global-require
      filename: `${__dirname}/../${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    })
  ],
  exitOnError: false
});
