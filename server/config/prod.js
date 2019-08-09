"use strict";

let pkg 	= require("../../package.json");
let path 	= require("path");

const nodes = process.env.ESNODES ? process.env.ESNODES.split(',') : pkg.config.es.nodes;

module.exports = {
	app: {
	},

	logging: {
		console: {
			level: "info"
		},
		file: {
			enabled: true,
		}
	},

	es: {
		INDEX_PREFIX: pkg.config.es.prefix || "yggdrash-",
		BLOCK_INDEX: pkg.config.es.index.block || "block",
		TX_INDEX: pkg.config.es.index.tx || "tx",
		index : pkg.config.es.index,
		level: pkg.config.es.level || "error",

		nodes: nodes || pkg.config.es.nodes
	},
	yggdrash: {
		node: {
			protocol: 	pkg.config.yggdrash.node.proxy.protocol,
			ip		: 	process.env.PROXYNODE_IP || pkg.config.yggdrash.node.proxy.ip,
			port	: 	process.env.PROXYNODE_PORT|| pkg.config.yggdrash.node.proxy.port
		},
		branch: {
			id: process.env.BRANCH || pkg.config.yggdrash.branch.id
		},
		contract	: {
			version : process.env.CONTRACT || pkg.config.yggdrash.contract.version,
			name : process.env.CONTRACT_NAME || pkg.config.yggdrash.contract.name
		}
	}


};
