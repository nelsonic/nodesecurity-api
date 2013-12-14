var Hapi = require('hapi');
var config = require('config');
var server = new Hapi.Server(config.host, config.port, config.hapi);
var User = require('./models/user');
var bcrypt = require('bcrypt');
var logger = require('bucker').createLogger(config.bucker);

function validate(username, password, callback) {
    User.findOne({username: username}, function (err, user) {
        if (!user) {
            return callback(null, false);
        }

        bcrypt.compare(password, user.password, function (err, isValid) {
            callback(err, isValid, { id: user.id, user: user, role: user.role });
        });
    });
}

var sarge_config = {
    handler: function (request, config, next) {
        var userRole = request.auth.credentials.role,
            isAuthorized = false;

        // TODO: may need to cast config.roles string to an array
        // or other sanity checks to ensure it is ['val', 'val'] format

        config.roles.forEach(function (role) {
            if (userRole === role) isAuthorized = true;
        });

        if (isAuthorized) {
            return next();
        } else {
            return next(Hapi.error.unauthorized("Not Authorized"));
        }
    }
}

server.auth('simple', {
    scheme: 'basic',
    validateFunc: validate
});

// REST API routes
require('./routes/user')(server);
require('./routes/aoi')(server);
require('./routes/report')(server);

// Packs
server.pack.require('sarge', sarge_config, function () {});

server.start(function () {
    console.log('Server started at: ' + server.info.uri);
});

