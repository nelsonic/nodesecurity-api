var store   = require('./../../store');
var User    = store.models.User;
var config  = require('config');
var logger  = require('bucker').createLogger(config.bucker, module);
var Hapi    = require('hapi');

/**
 *  Get a list of users
 */
exports.getBatch = function (request, reply) {

  User.all(function (err, users) {
    if (err) {
      return reply(Hapi.error.internal('User lookup failed', err));
    }
    reply(users);
  });
};

/**
 *  Get one user
 */
exports.get = function (request, reply) {
  User.get(request.params.user_id, function (err, user) {
    if (err) {
      return reply(Hapi.error.internal('User lookup failed', err));
    }

    if (request.auth.credentials.admin || user.username === request.auth.credentials.username) {
      reply(user);
    } else {
      reply(Hapi.error.unauthorized('go away'));
    }
  });
};

/**
 *  Create a user
 */
exports.create = function (request, reply) {
  logger.log('CREATE NEW USER: \n' + request.payload);

  var u = User.create(request.payload);
  // set the password as an salted hash, using the onSet function
  u.password = request.payload.password;

  u.save(function (err) {
    if (err) {
      logger.error('User creation failed ' + err);
      return reply(Hapi.error.internal(err));
    }
    reply({_id: u.id}).code(201);
  });
};


/**
 *  Update a user
 */
exports.update = function (request, reply) {

  User.get(request.params.user_id, function (err, user) {
    if (err) {
      return reply(Hapi.error.notFound(Error('User not found')));
    }

    if (request.auth.credentials.admin || user.username === request.auth.credentials.username) {
    // if (user.username === request.auth.credentials.username) {  
      Object.keys(request.payload).forEach(function (key) {
        logger.log(request.payload);
        user[key] = request.payload[key];
      });
      user.save(function (err) {
        if (err) {
          return logger.error(err);
        }
        reply(user);
      });
    } else {
      reply(Hapi.error.unauthorized('go away'));
    }
  });

};

/**
 *  Remove a user
 */
exports.remove = function (request, reply) {

  User.get(request.params.user_id, function (err, user) {
    if (err) {
      return reply(Hapi.error.internal('User delete failed', err));
    }

    user.delete(function (err) {
      if (err) {
        return reply(Hapi.error.internal('User delete failed', err));
      }
      reply();
    });
  });
};
