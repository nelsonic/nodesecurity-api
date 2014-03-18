var config = require('config');
var logger = require('bucker').createLogger(config.bucker, module);
var Hapi   = require('hapi');

exports.get = function (request, reply) {
	var self = this;

	logger.debug('GET /reports/{module_name}/{module_version}');

	var moduleName = request.params.module_name;
	var moduleVersion = request.params.module_version;

	// TODO: Get published vulnerability reports for this module@version
	// TODO: Filter list: admins get everything, public only gets published vulnerability reports

	reply(Hapi.error.notImplemented());
};

/**
 *	Create a report
 */
exports.create = function (request, reply) {
	// TODO: Save new report
	reply(Hapi.error.notImplemented());
};

/**
 *	Update a handler
 */
exports.update = function (request, reply) {
	var reportId = request.params.report_id;

	// TODO: Save updated report

	reply(Hapi.error.notImplemented());
};
