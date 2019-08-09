"use strict";

let pkg = require("../../package.json");

module.exports = {
	app: {
		title: pkg.name + " [Test mode]"
	},

	test: true,

	es: {
		host: "http://13.125.58.200",
		port: "9200",
		branch: "98790b39c9010759bf3a588eb2d5ea5467764b8e",
		contractVersion: "1319aef6bf061927e9e26fb19da1020f73e01588" ,
		INDEX_PREFIX: "yggdrash-",
		BLOCK_INDEX: "block",
		TX_INDEX: "tx",
		index : pkg.config.es.index
	}

};
