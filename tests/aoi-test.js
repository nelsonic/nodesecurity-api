var Hapi    = require('hapi');
var config  = require('config');
var bcrypt  = require('bcrypt');
var store   = require('./../store');
store.attachDB();
var User    = store.models.User;
var server  = new Hapi.Server();


// 
// Tests
// 
exports.setUp = function (callback) {
    callback();
},

exports.tearDown = function (callback) {
    callback();
},

exports['Register the aoi Plugin'] = function (test) {
    // clean the DB
    // fritzy is building a .wipe functionality for the db
    // 


    var hapi_plugins = {
        'hapi-auth-basic': null,
        'bucker': config.bucker
    };

    server.pack.require(hapi_plugins, function (err) {
        test.ifError(err);
        server.auth.strategy('simple', 'basic', { validateFunc: validate });

        server.pack.register(require('./../plugins/aoi'), {}, function (err) {
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






//
// Old tests (not sure still if they are valid)
//


// describe('GET /aoi/async/0.2.9', function () {
//         it('should return published AOIs', function (done) {
//             request({
//                 method: 'GET',
//                 url: apiUrl + '/aoi/async/0.2.9'
//             }, function (err, response, body) {
//                 assert.ifError(err);
//                 assert.equal(response.statusCode, 501);
//                 // TODO: Assert expected response
//                 done();
//             });
//         });

//         it('should return all AOIs for admin users', function (done) {
//             request({
//                 method: 'GET',
//                 url: apiUrl + '/aoi/async/0.2.9',
//                 auth: {
//                     user: admin.username,
//                     pass: admin.password,
//                     sendImmediately: true
//                 }
//             }, function (err, response, body) {
//                 assert.ifError(err);
//                 assert.equal(response.statusCode, 501);
//                 // TODO: Assert expected response
//                 done();
//             });
//         });
//     });

//     describe('POST /aoi/async/0.2.9', function () {
//         it('should allow anyone to create an AOI', function (done) {
//             var aoi = {}; // TODO ceate mock AOI
//             request({
//                 method: 'POST',
//                 url: apiUrl + '/aoi/async/0.2.9',
//                 json: aoi
//             }, function (err, response, body) {
//                 assert.ifError(err);
//                 assert.equal(response.statusCode, 501);
//                 // TODO: Assert expected response
//                 done();
//             });
//         });
//     });