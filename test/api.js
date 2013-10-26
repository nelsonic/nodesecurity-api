var assert = require('assert'),
    request = require('request'),
    config = require('config'),
    testServer = require('./fixtures/test-server'),
    apiUrl = 'http://' + config.host + ':' + config.port;

var admin = {
    username: 'a@b.com',
    password: 'letmein'
};

describe("Node Security API", function () {

    /**
     * Before all tests in this suite, start a test server and wipe the DB
     */
    before(function (done) {
        testServer.start(function (er) {
            if (er) throw er;
            testServer.wipe(function (er) {
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
                assert.ifError(body);
                assert.equal(response.statusCode, 200); 
            });
        });
    });
    
});
