var assert = require('assert');
var request = require('request');
var config = require('config');
var testServer = require('./fixtures/test-server');
var User = require('../models/user');
var apiUrl = 'http://' + config.host + ':' + config.port;

var admin = {
    username: 'admin@nodesecurity.io',
    password: 'letmein'
};

var user1 = {
    username: 'user@nodesecurity.io',
    password: 'letmein'
};

describe("Node Security API", function () {

    /**
     * Before all tests in this suite, start a test server and wipe the DB
     */
    before(function (done) {
        testServer.wipe(function (er) {
            if (er) throw er;
            testServer.start(function (er) {
                if (er) throw er;
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
            if (er) throw er;
            done();
        });
    });

    // Users
    describe("POST /user", function () {
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
    describe("POST /user", function () {
        it('should allow admin to create user', function (done) {
            request({
                method: 'POST',
                url: apiUrl + '/user',
                auth: {
                    user: admin.username,
                    pass: admin.password,
                    sendImmediately: true
                },
                json: user1
            }, function (err, response, body) {
                assert.ifError(body);
                assert.equal(response.statusCode, 201);
                done();
            });
        });
    });

    describe("GET /users", function () {
        it('Should disallow public access', function (done) {
            request(apiUrl + '/users', function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });
    });

    describe("GET /users", function () {
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


    // NOT DONE
    /*
    describe("DELETE /user/{id}", function () {
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
*/
    
});
