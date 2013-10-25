var Hapi = require('hapi');
var config = require('config');
var server = new Hapi.Server(config.host, config.port);
var db = require('./db').mongoose;
var User = require('./models/user');
var bcrypt = require('bcrypt');


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
        var roles = Hapi.utils.intersect(request.route.app.roles, request.auth.credentials.user.roles);
        if (roles.length === 0) {
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
        app: {
            roles: [
                'admin',
            ]
        }
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
            request.reply(user);
        });
    },
    config: {
        validate: {
            path: {
                user_id: Hapi.types.String().required().regex(/[a-zA-Z0-9]{24}/)
            }
        },
        plugins: {
            sarge: {
                role: 'admin'
            }
        }
    }
});

// POST /user
// Create user
server.route({
    method: 'POST',
    path: '/user',
    handler: function (request) {
        User.create(request.payload, function (err, user) {
            if (err)
                return request.reply(Hapi.error.internal('User creation failed', err));
            request.reply('User created');
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
        plugins: {
            sarge: {
                role: 'admin'
            }
        }
    }
});

// DELETE /user/{user_id}
server.route({
    method: 'DELETE',
    path: '/user/{user_id}',
    handler: function (request) {
        User.remove({_id: request.params.user_id}, function (err, user) {
            if (err)
                return request.reply(Hapi.error.internal('User delete failed', err));
            request.reply();
        });
    },
    config: {
        validate: {
            path: {
                user_id: Hapi.types.String().required().regex(/[a-zA-Z0-9]{24}/)
            }
        },
        plugins: {
            sarge: {
                role: 'admin'
            }
        }
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
            Object.keys(request.payload).forEach(function (key) {
                user[key] = request.payload[key];
            });
            user.save();
            request.reply(user);
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
        plugins: {
            sarge: {
                role: 'admin'
            }
        }
    }
});

server.start(function () {
    console.log('Server started at: ' + server.info.uri);
});
