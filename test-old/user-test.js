var assert = require('assert');
var request = require('request');
var config = require('config');
var testServer = require('./fixtures/test-server');
var store   = require('./../store');
var User    = store.models.User;
var apiUrl = 'http://' + config.host + ':' + config.port;

var admin = require('./fixtures/logins/admin');
var user1 = require('./fixtures/logins/user1');
var user2 = require('./fixtures/logins/user2');

describe('Node Security API - user', function () {

    /**
     * Before all tests in this suite, start a test server and wipe the DB
     */
    before(function (done) {
        testServer.wipe(function (er) {
            if (er) { throw er; }
            testServer.start(function (er) {
                if (er) { throw er; }
                console.log('Testing API at', apiUrl);
                done();
            });
        });
    });

    /**
     * After all tests in this suite, stop the test server
     */
    after(function (done) {
        testServer.stop(function (er) {
            if (er) { throw er; }
            done();
        });
    });

    // Users
    describe('POST /user', function () {
        it('should disallow public access', function (done) {
            request({
                method: 'POST',
                url: apiUrl + '/user',
                json: user1
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                User.findOne({username: user1.username}, function (err, user) {
                    assert.ifError(err);
                    assert.equal(user, null, 'user should not exist');
                    done();
                });
            });
        });
    });

    // Users
    describe('POST /user', function () {
        it('should allow admin to create user', function (done) {
            request({
                method: 'POST',
                url: apiUrl + '/user',
                auth: {
                    username: admin.username,
                    pass: admin.password,
                    sendImmediately: true
                },
                json: user1
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 201);
                user1._id = body._id;
                done();
            });
        });
    });

    describe('POST /user', function () {
        it('should disallow regular user from creating a user', function (done) {
            request({
                method: 'POST',
                url: apiUrl + '/user',
                auth: {
                    user: user1.username,
                    pass: user1.password,
                    sendImmediately: true
                },
                json: user2
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });

    // Used for future tests (not really that useful of a test :)
    describe('POST /user', function () {
        it('should allow admin to create second user', function (done) {
            request({
                method: 'POST',
                url: apiUrl + '/user',
                auth: {
                    user: admin.username,
                    pass: admin.password,
                    sendImmediately: true
                },
                json: user2
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 201);
                user2._id = body._id;
                done();
            });
        });
    });

    describe('GET /user/{id}', function () {
        it('should disallow public access', function (done) {
            request({
                url: apiUrl + '/user/' + user1._id
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });

    describe('GET /user/{id}', function () {
        it('should allow admin access', function (done) {
            request({
                url: apiUrl + '/user/' + user1._id,
                auth: {
                    user: admin.username,
                    pass: admin.password,
                    sendImmediately: true
                },
                json: true
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 200);
                assert.equal(body.username, user1.username);
                done();
            });
        });
    });

    describe('GET /user/{id}', function () {
        it('should allow owner access', function (done) {
            request({
                url: apiUrl + '/user/' + user1._id,
                auth: {
                    user: user1.username,
                    pass: user1.password,
                    sendImmediately: true
                },
                json: true
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 200);
                assert.equal(body.username, user1.username);
                done();
            });
        });
    });


    describe('GET /user/{id}', function () {
        it('should disallow other user access', function (done) {
            request({
                url: apiUrl + '/user/' + user1._id,
                auth: {
                    user: user2.username,
                    pass: user2.password,
                    sendImmediately: true
                },
                json: true
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });


    describe('GET /users', function () {
        it('Should disallow public access', function (done) {
            request(apiUrl + '/users', function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });

    describe('GET /users', function () {
        it('Should allow admin access', function (done) {
            request({
                method: 'GET',
                url: apiUrl + '/users',
                auth: {
                    user: admin.username,
                    pass: admin.password,
                    sendImmediately: true
                }
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 200);
                done();
            });
        });
    });

    describe('PUT /user/{id}', function () {
        it('should disallow public access', function (done) {
            request({
                method: 'PUT',
                url: apiUrl + '/user/' + user1._id,
                json: user1
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });

    describe('PUT /user/{id}', function () {
        it('should disallow other user access', function (done) {
            request({
                method: 'PUT',
                url: apiUrl + '/user/' + user1._id,
                auth: {
                    user: user2.username,
                    pass: user2.password,
                    sendImmediately: true
                },
                json: {first_name: 'user1'}
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });

    describe('PUT /user/{id}', function () {
        it('should allow owner access', function (done) {
            request({
                method: 'PUT',
                url: apiUrl + '/user/' + user1._id,
                auth: {
                    user: user1.username,
                    pass: user1.password,
                    sendImmediately: true
                },
                json: {
                    first_name: 'user1',
                    last_name: 'last',
                    username: 'user1@nodesecurity.io'
                }
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 200);
                done();
            });
        });
    });

    describe('DELETE /user/{id}', function () {
        it('Should disallow public access', function (done) {
            request({
                method: 'DELETE',
                url: apiUrl + '/user/' + user1._id
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });

    describe('DELETE /user/{id}', function () {
        it('Should disallow user access', function (done) {
            request({
                method: 'DELETE',
                url: apiUrl + '/user/' + user1._id,
                auth: {
                    user: user1.username,
                    pass: user1.password,
                    sendImmediately: true
                }
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });


    describe('DELETE /user/{id}', function () {
        it('Should allow admin access', function (done) {
            request({
                method: 'DELETE',
                url: apiUrl + '/user/' + user1._id,
                auth: {
                    user: admin.username,
                    pass: admin.password,
                    sendImmediately: true
                }
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 200);
                // Make sure it doesn't exist
                User.find({username: user1.username}, function (err, user) {
                    assert.ifError(err);
                    assert.strictEqual(0, user.length);
                    done();
                });
            });
        });
    });

});
