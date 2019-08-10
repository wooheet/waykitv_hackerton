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
	}
};
