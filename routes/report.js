var Hapi = require('hapi');
var config = require('config');
var logger = require('bucker').createLogger(config.bucker, module);

module.exports = function (server) {
    // GET /reports/{module_name}/{module_version}
    // Get vulnerability reports for a module@version
    server.route({
        method: 'GET',
        path: '/reports/{module_name}/{module_version}',
        handler: function (request) {
            logger.debug('GET /reports/{module_name}/{module_version}');

            var moduleName = request.params.module_name;
            var moduleVersion = request.params.module_version;

            // TODO: Get published vulnerability reports for this module@version
            // TODO: Filter list: admins get everything, public only gets published vulnerability reports

            request.reply(Hapi.error.notImplemented());
        },
        config: {
            validate: {
                path: {
                    module_name: Hapi.types.String().required(),
                    // TODO: Use `semver.valid` https://github.com/isaacs/node-semver#functions
                    module_version: Hapi.types.String().required()
                }
            }
        }
    });

    // POST /report
    // Create a vulnerability report
    server.route({
        method: 'POST',
        path: '/report',
        handler: function (request) {
            // TODO: Save new report
            request.reply(Hapi.error.notImplemented());
        },
        config: {
            validate: {
                payload: {
                    module_name: Hapi.types.String().required(),
                    // TODO: Use `semver.valid` https://github.com/isaacs/node-semver#functions
                    module_version: Hapi.types.String().required()
                    // TODO: The rest of the report data
                }
            },
            auth: 'simple'
        }
    });

    // PUT /report
    // Update a vulnerability report
    server.route({
        method: 'PUT',
        path: '/report/{report_id}',
        handler: function (request) {
            var reportId = request.params.report_id;

            // TODO: Save updated report

            request.reply(Hapi.error.notImplemented());
        },
        config: {
            validate: {
                path: {
                    report_id: Hapi.types.String().required()
                },
                payload: {
                    module_name: Hapi.types.String().required(),
                    // TODO: Use `semver.valid` https://github.com/isaacs/node-semver#functions
                    module_version: Hapi.types.String().required()
                    // TODO: The rest of the report data
                }
            },
            auth: 'simple'
        }
    });
};