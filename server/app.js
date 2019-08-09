"use strict";
const config = require('./config');
const logger = require('./core/logger');
const moment = require('moment');
const chalk = require('chalk');

const _ = require('lodash');

logger.info("==============================================================================================");
logger.info(chalk.bold("---------------------[ Server starting at %s ]---------------------------"), moment().format("YYYY-MM-DD HH:mm:ss.SSS"));
logger.info("==============================================================================================");
logger.info(chalk.bold("Application root path: ") + global.rootPath);

const app = require('./core/express')();

// require("./libs/gracefulExit");

app.listen(config.port, config.ip, function () {
  logger.info("");
  logger.info(chalk.bold(config.app.title) + " " + chalk.bold(config.app.version));
  logger.info("");
  logger.info("Environment\t | \t" + chalk.underline.bold(process.env.NODE_ENV));
  logger.info("IP\t\t | \t" + config.ip);
  logger.info("Port\t\t | \t" + config.port);
  // logger.info("Database:\t\t" + config.db.uri);
  // logger.info("Redis:\t\t" + (config.redis.enabled ? config.redis.uri : "Disabled"));
  logger.info("");
  if (process.env.NODE_ENV !== "process") {
    logger.info("==============================================================================================");
    logger.info(chalk.bold("\t-------------------------[ System Information ]-------------------------------"));
    logger.info("==============================================================================================");
    require('./libs/sysinfo')();
    logger.info("");
  }

});
