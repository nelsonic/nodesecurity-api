var Hapi = require('hapi');
var config = require('config');
var logger = require('bucker').createLogger(config.bucker, module);

module.exports = function (server) {
    // GET /aoi/{module_name}/{module_version}
    // Get AOIs for a module@version
    server.route({
        method: 'GET',
        path: '/aoi/{module_name}/{module_version}',
        handler: function (request) {
            logger.debug('GET /aoi/{module_name}/{module_version}');

            var moduleName = request.params.module_name;
            var moduleVersion = request.params.module_version;

            // TODO: Get AOIs for this module@version
            // TODO: Filter list: admins get everything, public only gets AOIs published as part of vulnerability report

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

    // POST /aoi/{module_name}/{module_version}
    // Create an AOI
    server.route({
        method: 'POST',
        path: '/aoi/{module_name}/{module_version}',
        handler: function (request) {
            logger.debug('POST /aoi/{module_name}/{module_version}');

            var moduleName = request.params.module_name;
            var moduleVersion = request.params.module_version;

            // TODO: Can anyone create an AOI?
            // TODO: Save new AOI

            request.reply(Hapi.error.notImplemented());
        },
        config: {
            validate: {
                path: {
                    module_name: Hapi.types.String().required(),
                    // TODO: Use `semver.valid` https://github.com/isaacs/node-semver#functions
                    module_version: Hapi.types.String().required()
                },
                payload: {
                    // TODO
                }
            }
        }
    });
};