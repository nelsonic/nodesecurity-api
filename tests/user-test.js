var Hapi    = require('hapi');
var config  = require('config');
var bcrypt  = require('bcrypt');
var store   = require('./../store');
store.attachDB();
var User    = store.models.User;
var server  = new Hapi.Server();
var exec    = require('child_process').exec;

// 
// I'm pretty confident that there should be a set up function and the 
// respective tear down, but I'll follow nodesecurity-www pattern and come back
// to that when all tests are here
// 
exports['Register the User Plugin'] = function (test) {
    exec('rm -r ' + config.db, function (err, stdout, stderr) {
        test.ifError(err);
    });

    // Run the script to add the admin
    // 


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

exports['GET /users - Should not allow Public Access'] = function (test) {
    server.inject({
        method: 'GET',
        url: '/users'
    }, function (res) {
        test.equal(res.statusCode, '401', 'should return a 401');
        test.done();
    });
};






// describe('GET /users', function () {
//     it('Should disallow public access', function (done) {
//         request(apiUrl + '/users', function (err, response, body) {
//             assert.ifError(err);
//             assert.equal(response.statusCode, 401);
//             done();
//         });
//     });
// });

// describe('GET /users', function () {
//     it('Should allow admin access', function (done) {
//         request({
//             method: 'GET',
//             url: apiUrl + '/users',
//             auth: {
//                 user: admin.username,
//                 pass: admin.password,
//                 sendImmediately: true
//             }
//         }, function (err, response, body) {
//             assert.ifError(err);
//             assert.equal(response.statusCode, 200);
//             done();
//         });
//     });
// });




// exports['valid payload - vulns'] = function (test) {
//     server.inject({
//         method: 'POST',
//         url: '/validate/shrinkwrap',
//         payload: valid_vulns

//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(payload.length, 2);
//         test.ok(payload[0].module, 'should have a module key');
//         test.ok(payload[0].version, 'should have a version key');
//         test.ok(payload[0].advisory, 'show have an advisory key');
//         test.done();
//     });
// };

// exports['invalid payload: no name, empty dependencies'] = function (test) {
//     // No name
//     // empty dependencies

//     server.inject({
//         method: 'POST',
//         url: '/validate/shrinkwrap',
//         payload: invalid_1
//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(res.payload, '[]', 'should return no results');
//         test.done();
//     });
// };

// exports['invalid payload: vuln module, no version'] = function (test) {
//     server.inject({
//         method: 'POST',
//         url: '/validate/shrinkwrap',
//         payload: invalid_2
//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(res.payload, '[]', 'should return no results');
//         test.done();
//     });
// };

// exports['invalid payload: vuln module, invalid version'] = function (test) {
//     server.inject({
//         method: 'POST',
//         url: '/validate/shrinkwrap',
//         payload: invalid_3
//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(res.payload, '[]', 'should return no results');
//         test.done();
//     });
// };

// exports['non existent module'] = function (test) {
//     server.inject({
//         method: 'GET',
//         url: '/validate/herpmcderp/1.2.1'
//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(res.payload, '[]', 'should return no results');
//         test.done();
//     });
// };

// exports['existing module wrong version'] = function (test) {
//     server.inject({
//         method: 'GET',
//         url: '/validate/tomato/1.2.1'
//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(res.payload, '[]', 'should return no results');
//         test.done();
//     });
// };


// exports['existing module invalid version'] = function (test) {
//     server.inject({
//         method: 'GET',
//         url: '/validate/tomato/1.'
//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(res.payload, '[]', 'should return no results');
//         test.done();
//     });
// };


// exports['existing module vuln version'] = function (test) {
//     server.inject({
//         method: 'GET',
//         url: '/validate/tomato/0.0.1'
//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(payload.length, 1);
//         test.done();
//     });
// };

// exports['Dependency Tree'] = function (test) {
//     server.inject({
//         method: 'POST',
//         url: '/validate/shrinkwrap',
//         payload: valid_nested

//     }, function (res) {
//         var payload;
//         test.equal(res.statusCode, '200', 'should return a 200');
//         test.doesNotThrow(function () {payload = JSON.parse(res.payload); });
//         test.equal(payload.length, 1);
//         test.ok(payload[0].module, 'should have a module key');
//         test.ok(payload[0].version, 'should have a version key');
//         test.ok(payload[0].advisory, 'should have an advisory key');
//         test.deepEqual(payload[0].dependencyOf, ['root', 'second'], 'should have second and root as parents');
//         test.done();
//     });
// };

