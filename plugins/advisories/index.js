var Hapi        = null; // Initialized during plugin registration
var advisories  = require('nodesecurity-advisories');
var validate    = require('./validate');
var semver      = require('semver');

exports.name    = 'advisories';
exports.version = '1.0.0';

var internals = {};

internals.defaults = {
    title: 'Advisories'
};

exports.register = function (plugin, options, next) {
    plugin.log(['info', 'advisories'], 'advisories plugin registered');

    internals.setHapi(plugin.hapi);
    var Utils = plugin.hapi.utils;
    var settings = Utils.applyToDefaults(internals.defaults, options);
    var module_index;
    advisories(function (err, mi) {
        if (err) {
            plugin.log(['err', 'advisories'], err);
        }
        module_index = mi;
        console.log('MODULE_INDEX: \n', module_index);
    });


    // npm shrinkwrap search
    plugin.route({
        method: 'POST',
        path: '/validate/shrinkwrap',
        config: {
            payload: {
                allow: 'application/json'
            }
        },
        handler: function (request, reply) {
            console.log('MODULE_INDEX: \n', module_index);
            reply(validate(request.payload, module_index));
        }
    });

    plugin.route({
        method: 'GET',
        path: '/validate/{module}/{version}',
        handler: function (request, reply) {
            var data = module_index[request.params.module] || {};
            var result = [];
            Object.keys(data).forEach(function (key) {
                var advisory = data[key];
                if (semver.valid(request.params.version) && semver.satisfies(request.params.version, advisory.vulnerable_versions)) {
                    result.push(advisory);
                }
            });
            reply(result);
        }
    });
    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};
