const winston = require('winston');
const Sentry = require('winston-sentry');
const mkdirp = require('mkdirp');
const { dirname } = require('path');
const context = require('./context');
let transports = [];

/**
 * Transformer function to transform log data as provided by winston into
 * a message structure which is more appropriate for indexing in ES.
 * 
 * @param { Object } logData
 * @param { Object } logData.message - the log message
 * @param { Object } logData.level - the log level
 * @param { Object } logData.meta - the log meta data
 * 
 * @returns { Object } transformed message
 */
const formatter = function transformer(logData) {
  const transformed = {};
  transformed['timestamp'] = new Date().toISOString();
  transformed.time = new Date().toISOString();
  transformed.message = logData.message;
  transformed.severity = logData.level;
  transformed.context = logData.meta || {};
  transformed.extra = context.getAll();

  return JSON.stringify(transformed);
};

if (process.env.APP__DEBUG === 'yes') {
  transports.push(new (winston.transports.Console)({
        level: 'debug',
        colorize: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        formatter: formatter,
        timestamp: () => (new Date()).toLocaleString(),
  }));
} else {
  // console
  transports.push(new (winston.transports.Console)({
        level: 'debug',
        colorize: true,
        formatter: formatter,
        timestamp: () => (new Date()).toLocaleString(),
  }));

  // sentry
  transports.push(new Sentry({
        level: 'warn',
        dsn: process.env.SENTRY__DSN,
        environment: process.env.APP__ENV_NAME,
        release: process.env.APP__VERSION_HASH,
  }));
}

// configure logger
let logger = new (winston.Logger)({ transports: transport });
logger.context = context;

winston.setLevels(winston.config.syslog.levels);

module.exports = logger;