var Hapi    = require('hapi');
var config  = require('config');
var async   = require('async');

var store   = require('./store');
// store.attachDB();
var User    = store.models.User;

var bcrypt  = require('bcrypt');
var logger  = require('bucker').createLogger(config.bucker);
var server  = new Hapi.Server(config.host, config.port, config.hapi);

var hapi_plugins = {
    'hapi-auth-basic': null,
    'bucker': config.bucker
};

var nsp_plugins = [
    require('./plugins/user'),
    require('./plugins/aoi'),
    require('./plugins/report'),
    require('./plugins/advisories')
];

server.pack.require(hapi_plugins, function (err) {
    
    if (err) {
        logger.log('Failed to load a hapi_plugins: ', err);
        process.exit(1);
    }
    server.auth.strategy('simple', 'basic', { validateFunc: validate });
    // Register all the plugins
    async.each(nsp_plugins, registerPlugin, function (err) {
        if (err) {
            logger.log('Failed to load a nsp_plugins: ', err);
            process.exit(1);
        }
        server.start(function () {
            logger.log('Server started at: ' + server.info.uri);
        });
    });

    function registerPlugin(plug, cb) {
        server.pack.register(plug, {}, function (err) {
            if (err) {
                logger.log('Failed loading a nsp_plugin: ' + plug.name);
                process.exit(1);
            }
            cb();
        });
    }
});

function validate(username, password, callback) {
    User.findByUserName(username, function (err, user) {
        user = user.toJSON({withPrivate: true});
        if (!user) {
            return callback(null, false);
        }
        bcrypt.compare(password, user.password, function (err, isValid) {
            callback(err, isValid, { id: user.key, user: user });
        });
    });
}