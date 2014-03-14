var Hapi = require('hapi');
var handlers = require('../handlers/user');

module.exports = function (server) {
    // GET /users
    server.route({
        method: 'GET',
        path: '/users',
        handler: handlers.getBatch,
        config: {
            auth: 'simple'
        }
    });

    // GET /user/{user_id}
    server.route({
        method: 'GET',
        path: '/user/{user_id}',
        handler: handlers.get,
        config: {
            validate: {
                path: {
                    user_id: Hapi.types.String().required().regex(/[a-zA-Z0-9]{24}/)
                }
            },
            auth: 'simple'
        }
    });

    // POST /user
    // Create user
    server.route({
        method: 'POST',
        path: '/user',
        handler: handlers.create,
        config: {
            validate: {
                payload: {
                    first_name: Hapi.types.String(),
                    last_name: Hapi.types.String(),
                    username: Hapi.types.String().required().email(),
                    password: Hapi.types.String().required()
                }
            },
            auth: 'simple'
        }
    });

    // DELETE /user/{user_id}
  // Remove user
    server.route({
        method: 'DELETE',
        path: '/user/{user_id}',
        handler: handlers.remove,
        config: {
            validate: {
                path: {
                    user_id: Hapi.types.String().required().regex(/[a-zA-Z0-9]{24}/)
                }
            },
            auth: 'simple'
        }
    });

    // PUT /user/{user_id}
    server.route({
        method: 'PUT',
        path: '/user/{user_id}',
        handler: handlers.update,
        config: {
            validate: {
                payload: {
                    first_name: Hapi.types.String(),
                    last_name: Hapi.types.String(),
                    username: Hapi.types.String().email()
                }
            },
            auth: 'simple'
        }
    });

    // TODO: Route to make a user an admin
    // TODO: Route to change user password
};
