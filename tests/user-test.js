var Hapi    = require('hapi');
var config  = require('config');
var bcrypt  = require('bcrypt');
var store   = require('./../store');
var User    = store.models.User;
var server  = new Hapi.Server();
// var admin   = require('./data/admin.js');
var user1   = require('./data/user1.js');
var user2   = require('./data/user2.js');

// 
// Tests
// 
exports.setUp = function (callback) {
    callback();
},

exports.tearDown = function (callback) {
    callback();
},

exports['Wipe the DB first'] = function (test) {
    User.wipe(function (err) {
        test.ifError(err);
        test.done();
    });
};

exports['Register the User Plugin'] = function (test) {

    var hapi_plugins = {
        'hapi-auth-basic': null,
        'bucker': config.bucker
    };

    server.pack.require(hapi_plugins, function (err) {
        test.ifError(err);
        server.auth.strategy('simple', 'basic', { validateFunc: validate });

        server.pack.register(require('./../plugins/user'), {}, function (err) {
            test.ifError(err);
            test.done();
        });
    });

    function validate(username, password, callback) {
        User.findByUserName(username, function (err, user) {
            if (!user) {
                return callback(null, false);
            }
            bcrypt.compare(password, user.password, function (err, isValid) {
                callback(err, isValid, { id: user.key, user: user });
            });
        });
    }
};


exports['POST /user - Should not allow Public Access'] = function (test) {
    server.inject({
        method: 'POST',
        url: '/user',
        payload: user1
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};


exports['POST /user - Should allow Admin Access (create user1)'] = function (test) {
    server.inject({
        method: 'POST',
        url: '/user',
        credentials: {
            user: {
                admin: true
            }
        },
        payload: user1
    }, function (res) {
        var payload;
        test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
        test.equal(res.statusCode, '201', 'should return a 201');
        user1._id = payload._id;
        test.done();
    });
};

exports['POST /user - Should not allow normal User Access'] = function (test) {
    server.inject({
        method: 'POST',
        url: '/user',
        credentials: {
            user: {
                admin: false
            }
        },
        payload: user2
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};


exports['POST /user - Should allow Admin Access (create user2)'] = function (test) {
    server.inject({
        method: 'POST',
        url: '/user',
        credentials: {
            user: {
                admin: true
            }
        },
        payload: user2
    }, function (res) {
        var payload;
        test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
        test.equal(res.statusCode, '201', 'should return a 201');
        user2._id = payload._id;
        test.done();
    });
};

exports['GET /user/{id} - Should not allow Public Access'] = function (test) {
    server.inject({
        method: 'GET',
        url: '/user/' + encodeURIComponent(user1._id)
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};

exports['GET /user/{id} - Should allow Admin Access'] = function (test) {
    server.inject({
        method: 'GET',
        url: '/user/' + encodeURIComponent(user1._id),
        credentials: {
            user: {
                admin: true
            }
        }
    }, function (res) {
        test.equal(res.statusCode, '200', 'should return a 200');
        var payload;
        test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
        test.equal(payload.password, undefined, 'it should not return user password');
        test.equal(payload.username, user1.username);
        test.done();
    });
};


exports['GET /user/{id} - Should allow Owner Access'] = function (test) {
    server.inject({
        method: 'GET',
        url: '/user/' + encodeURIComponent(user1._id),
        credentials: {
            user: {
                username: user1.username
            }
        }
    }, function (res) {
        test.equal(res.statusCode, '200', 'should return a 200');
        var payload;
        test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
        test.equal(payload.username, user1.username);
        test.done();
    });
};

exports['GET /user/{id} - Should not allow other user Access'] = function (test) {
    server.inject({
        method: 'GET',
        url: '/user/' + encodeURIComponent(user1._id),
        credentials: {
            user: {
                username: user2.username
            }
        }
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};

exports['GET /users - Should not allow Public Access'] = function (test) {
    server.inject({
        method: 'GET',
        url: '/users'
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};

exports['GET /users - Should allow Admin Access'] = function (test) {
    server.inject({
        method: 'GET',
        url: '/users',
        credentials: {
            user: {
                admin: true
            }
        }
    }, function (res) {
        test.equal(res.statusCode, '200', 'should return a 200');
        test.done();
    });
};

exports['PUT /user/{id} - Should not allow public  Access'] = function (test) {
    server.inject({
        method: 'PUT',
        url: '/user/' + encodeURIComponent(user1._id),
        payload: user1
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};


exports['PUT /user/{id} - Should not allow other user Access'] = function (test) {
    server.inject({
        method: 'PUT',
        url: '/user/' + encodeURIComponent(user1._id),
        credentials: {
            user: {
                username: user2.username
            }
        }
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};



exports['PUT /user/{id} - Should allow Owner Access'] = function (test) {
    var updatedUser = {
        first_name: 'user1',
        last_name: 'last'
    };
    server.inject({
        method: 'PUT',
        url: '/user/' + encodeURIComponent(user1._id),
        credentials: {
            user: {
                username: user1.username
            }
        },
        payload: updatedUser
    }, function (res) {
        test.equal(res.statusCode, '200', 'should return a 200');
        var payload;
        test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
        test.equal(payload.username, user1.username);
        test.equal(payload.first_name, updatedUser.first_name);
        user1.first_name = updatedUser.first_name;
        test.equal(payload.last_name, updatedUser.last_name);
        user1.last_name = updatedUser.last_name;
        test.done();
    });
};

exports['DELETE /user/{id} - Should not allow public Access'] = function (test) {
    server.inject({
        method: 'DELETE',
        url: '/user/' + encodeURIComponent(user1._id)
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};


exports['DELETE /user/{id} - Should not allow public Access'] = function (test) {
    server.inject({
        method: 'DELETE',
        url: '/user/' + encodeURIComponent(user1._id),
        credentials: {
            user: {
                username: user1.username
            }
        }
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};


exports['DELETE /user/{id} - Should allow admin Access'] = function (test) {
    server.inject({
        method: 'DELETE',
        url: '/user/' + encodeURIComponent(user1._id),
        credentials: {
            user: {
                admin: true
            }
        }
    }, function (res) {
        test.equal(res.statusCode, '200', 'should return a 200');
        test.done();
    });
};