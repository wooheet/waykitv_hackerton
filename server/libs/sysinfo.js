"use strict";

const os = require("os");
const clui = require("clui");
const pretty = require("pretty-bytes/index");
const logger = require("../core/logger");

module.exports = function() {
    const Gauge = clui.Gauge;
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const human = pretty(free);

    logger.info("CPU\t\t|\tArch: " + (os.arch()) + ", Cores: " + (os.cpus().length));
    logger.info("Memory\t\t|\t" + Gauge(used, total, 20, total * 0.8, human + " free"));
    logger.info("OS\t\t|\t" + (os.platform()) + " (" + (os.type()) + ")");
};
