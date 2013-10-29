var Hapi = require('hapi');
var config = require('config');
var server = new Hapi.Server(config.host, config.port, config.hapi);
var db = require('./db').mongoose;
var User = require('./models/user');
var bcrypt = require('bcrypt');
var logger = require('bucker').createLogger(config.bucker);


function validate(username, password, callback) {
    User.findOne({username: username}, function (err, user) {
        if (!user) {
            return callback(null, false);
        }

        bcrypt.compare(password, user.password, function (err, isValid) {
            callback(err, isValid, { id: user.id, user: user });
        });
    });
}


server.auth('simple', {
    scheme: 'basic',
    validateFunc: validate
});


// USER ROUTES
// GET /users
server.route({
    method: 'GET',
    path: '/users',
    handler: function (request) {
        if (!request.auth.credentials.user.admin) {
            return request.reply(Hapi.error.unauthorized('go away'));
        }

        User.find().select('-password').exec(function (err, users) {
            if (err)
                return request.reply(Hapi.error.internal('User lookup failed', err));
            request.reply(users);
        });
    },
    config: {
        auth: 'simple',
    }
});

// GET /user/{user_id}
server.route({
    method: 'GET',
    path: '/user/{user_id}',
    handler: function (request) {
        User.findOne({_id: request.params.user_id}).select('-password').exec(function (err, user) {
            if (err)
                return request.reply(Hapi.error.internal('User lookup failed', err));

            if (request.auth.credentials.user.admin || user.username === request.auth.credentials.user.username) {
                request.reply(user);
            } else {
                request.reply(Hapi.error.unauthorized('go away'));
            }
        });
    },
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
    handler: function (request) {
        logger.debug('POST /user ');
        if (!request.auth.credentials.user.admin) {
            return request.reply(Hapi.error.unauthorized('go away'));
        }

        User.create(request.payload, function (err, user) {
            if (err) {
                logger.error("User creation failed " + err);
                return request.reply(Hapi.error.internal(err));
            }
            request.reply({_id: user.id}).code(201);
        });
    },
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
server.route({
    method: 'DELETE',
    path: '/user/{user_id}',
    handler: function (request) {
        // Only admin can delete
        if (!request.auth.credentials.user.admin) {
            return request.reply(Hapi.error.unauthorized('go away'));
        }

        User.remove({_id: request.params.user_id}, function (err, user) {
            if (err) {
                return request.reply(Hapi.error.internal('User delete failed', err));
            }
            request.reply();
        });
    },
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
    handler: function (request) {
        User.findOne({_id: request.params.user_id}).select('-password').exec(function (err, user) {
            if (err)
                return request.reply(Hapi.error.notFound(Error("User not found")));

            if (request.auth.credentials.user.admin || user.username === request.auth.credentials.user.username) {
                Object.keys(request.payload).forEach(function (key) {
                    user[key] = request.payload[key];
                });
                user.save();
                request.reply(user);
            } else {
                request.reply(Hapi.error.unauthorized("go away"));
            }
        });
    },
    config: {
        validate: {
            payload: {
                first_name: Hapi.types.String(),
                last_name: Hapi.types.String(),
                username: Hapi.types.String().email(),
            }
        },
        auth: 'simple'
    }
});

// TODO: Route to make a user an admin
// TODO: Route to change user password

server.start(function () {
    console.log('Server started at: ' + server.info.uri);
});

