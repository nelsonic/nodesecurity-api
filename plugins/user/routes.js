var Hapi = require('hapi');
var resources = require('./resources.js');

module.exports = function (server) {
  // GET /users
  server.route({
    method: 'GET',
    path: '/users',
    handler: resources.getBatch,
    config: {
      auth: {
        strategy: 'simple',
        scope: ['admin']
      }
    }
  });

  // GET /user/{user_id}
  server.route({
    method: 'GET',
    path: '/user/{user_id}',
    handler: resources.get,
    config: {
      validate: {
        path: {
          user_id: Hapi.types.String().required()
        }
      },
      auth: {
        strategy: 'simple',
        scope: ['admin', 'user']
      }
    }
  });

  // POST /user
  // Create user
  server.route({
    method: 'POST',
    path: '/user',
    handler: resources.create,
    config: {
      validate: {
        payload: {
          first_name: Hapi.types.String(),
          last_name: Hapi.types.String(),
          username: Hapi.types.String().required().email(),
          password: Hapi.types.String().required()
        }
      },
      auth: {
        strategy: 'simple',
        scope: ['admin']
      }
    }
  });

  // DELETE /user/{user_id}
  // Remove user
  server.route({
    method: 'DELETE',
    path: '/user/{user_id}',
    handler: resources.remove,
    config: {
      validate: {
        path: {
          user_id: Hapi.types.String().required()
        }
      },
      auth: {
        strategy: 'simple',
        scope: ['admin']
      }
    }
  });

  // PUT /user/{user_id}
  server.route({
    method: 'PUT',
    path: '/user/{user_id}',
    handler: resources.update,
    config: {
      validate: {
        payload: {
          first_name: Hapi.types.String(),
          last_name: Hapi.types.String(),
          username: Hapi.types.String().email()
        }
      },
      auth: {
        strategy: 'simple',
        scope: ['admin', 'user']
      }
    }
  });

  // TODO: Route to make a user an admin
  // TODO: Route to make a user an contributor
  // TODO: Route to make a user an reviewer  
  // TODO: Route to change user password
};
