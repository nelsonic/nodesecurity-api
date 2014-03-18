var Hapi = require('hapi');
var handlers = require('./resources.js');

module.exports = function (server) {
    // GET /reports/{module_name}/{module_version}
    // Get vulnerability reports for a module@version
    server.route({
        method: 'GET',
        path: '/reports/{module_name}/{module_version}',
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

    // POST /report
    // Create a vulnerability report
    server.route({
        method: 'POST',
        path: '/report',
        handler: handlers.create,
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
        handler: handlers.update,
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
