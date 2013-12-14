var config = require('config');
var logger = require('bucker').createLogger(config.bucker, module);

exports.get = function (request) {
    var self = this;

    logger.debug('GET /reports/{module_name}/{module_version}');

    var moduleName = request.params.module_name;
    var moduleVersion = request.params.module_version;

    // TODO: Get published vulnerability reports for this module@version
    // TODO: Filter list: admins get everything, public only gets published vulnerability reports

    request.reply(this.hapi.error.notImplemented());
};

/**
 *  Create a report
 */
exports.create = function (request) {
    // TODO: Save new report
    request.reply(this.hapi.error.notImplemented());
};

/**
 *  Update a handler
 */
exports.update = function (request) {
    var reportId = request.params.report_id;

    // TODO: Save updated report

    request.reply(this.hapi.error.notImplemented());
};
