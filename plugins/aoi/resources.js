var config = require('config');
var logger = require('bucker').createLogger(config.bucker, module);
var Hapi   = require('hapi');

/**
 *	Get an AOI
 */
exports.get = function (request, reply) {
	var self = this;

	logger.debug('GET /aoi/{module_name}/{module_version}');

	var moduleName = request.params.module_name;
	var moduleVersion = request.params.module_version;

	// TODO: Get AOIs for this module@version
	// TODO: Filter list: admins get everything, public only gets AOIs published as part of vulnerability report

	reply(Hapi.error.notImplemented());
};

/**
 *	Create an AOI
 */
exports.create =  function (request, reply) {
	var self = this;

	logger.debug('POST /aoi/{module_name}/{module_version}');

	var moduleName = request.params.module_name;
	var moduleVersion = request.params.module_version;

	// TODO: Can anyone create an AOI?
	// TODO: Save new AOI

	reply(Hapi.error.notImplemented());
};
