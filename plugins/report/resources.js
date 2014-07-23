var config = require('config');
var logger = require('bucker').createLogger(config.bucker, module);
var Hapi   = require('hapi');
var store  = require('./../../store');
var Report = store.models.Report;

/**
 *  Get all the reports (if admin, or the associated with the user)
 */
exports.getAllReports = function (request, reply) {
  
  if (!request.auth.credentials.user.admin && !request.auth.credentials.user.reviewer) {
    return reply(Hapi.error.unauthorized('go away'));
  }

  Report.all({}, function (err, models, pagination) {

  });
  // reply(Hapi.error.notImplemented());
};

/**
 *  Get a Report by its id
 */
exports.getReportById = function (request, reply) {

  reply(Hapi.error.notImplemented());
};

/**
 *  Get a Report refering to a specific module name and version
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
 *  Create a report
 */
exports.create = function (request, reply) {

  var report = Report.create({
    reporter_username: request.params.reporter_username,
    module_name: request.params.module_name,
    module_version: request.params.module_version,
    description: request.params.description,
    how_to_replicate: request.params.how_to_replicate,
    gist: request.params.gist,
    other_links: request.params.other_links,
  });

  report.save(function (err) {
    if (err) {
      logger.error('Report creation failded ' + err);
      return reply(Hapi.error.internal('Report creation failded'));
    }
    reply({report_id: report.report_id}).code(201);
  });
};


/**
 *  Update a handler
 */
exports.update = function (request, reply) {
  var reportId = request.params.report_id;

  // TODO: Save updated report

  reply(Hapi.error.notImplemented());
};
