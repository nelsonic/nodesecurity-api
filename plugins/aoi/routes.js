var Hapi = require('hapi');
var handlers = require('./resources.js');

module.exports = function (server) {
    // GET /aoi/{module_name}/{module_version}
    // Get AOIs for a module@version
    server.route({
        method: 'GET',
        path: '/aoi/{module_name}/{module_version}',
        handler: handlers.get,
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
        handler: handlers.create,
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
