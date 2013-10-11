var Hapi = require('hapi');
var config = require('getconfig');
var server = new Hapi.Server('127.0.0.1', 3000);
var db = require('./db').mongoose;
var User = require('./models/user');
var Role = require('./models/role');

// USER ROUTES
// GET /users
server.route({
    method: 'GET',
    path: '/users',
    handler: function (request) {
        User.find().select('-password').exec(function (err, users) {
            if (err)
                return request.reply(Hapi.error.internal('User lookup failed', err));
            request.reply(users);
        });
    },
    config: {
        plugins: {
            sarge: {
                role: 'admin'
            }
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

// Roles Index
server.route({
    method: 'GET',
    path: '/user/{user_id}/roles',
    handler: function (request) {
        Role.find({_creator: request.params.user_id}, function (err, roles) {
            if (err)
                return request.reply(Hapi.error.notFound(Error("asdf")));
            request.reply(roles);
        });
    },
    config: {
        plugins: {
            sarge: {
                role: 'admin'
            }
        }
    }
});

// Create route
server.route({
    method: 'POST',
    path: '/user/{user_id}/role',
    handler: function (request) {
        request.payload._creator = request.params.user_id;
        Role.find(request.payload, function (err, role) {
            if (role && role.length > 0)
                return request.reply().code(201);
            Role.create(request.payload, function (err, role) {
                if (err)
                    return request.reply(Hapi.error.internal({message: "error creating role"}));
                request.reply(role);
            });
        });
    },
    config: {
        validate: {
            payload: {
                role: Hapi.types.String().required(),
            }
        },
        plugins: {
            sarge: {
                role: 'admin'
            }
        }
    }
});




server.start();
