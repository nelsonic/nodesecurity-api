var config = require('config');
var logger = require('bucker').createLogger(config.bucker, module);
var Hapi   = require('hapi');

/**
 *	Get all the reports (if admin, or the associated with the user)
 */
exports.getAllReports = function (request, reply) {

	reply(Hapi.error.notImplemented());
};

/**
 *	Get a Report by its id
 */
exports.getReportById = function (request, reply) {

	reply(Hapi.error.notImplemented());
};

/**
 *	Get a Report refering to a specific module name and version
 */
exports.getReportByModuleNameVersion = function (request, reply) {
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
