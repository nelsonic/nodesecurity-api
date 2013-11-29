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
            callback(err, isValid, { id: user.id, user: user });
        });
    });
}

server.auth('simple', {
    scheme: 'basic',
    validateFunc: validate
});

// REST API routes
require('./routes/user')(server);
require('./routes/aoi')(server);

server.start(function () {
    console.log('Server started at: ' + server.info.uri);
});

