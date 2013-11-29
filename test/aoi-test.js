var assert = require('assert');
var request = require('request');
var config = require('config');
var testServer = require('./fixtures/test-server');
var apiUrl = 'http://' + config.host + ':' + config.port;

var admin = require('./fixtures/logins/admin');

describe("Node Security API - AOI", function () {

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

    describe("GET /aoi/async/0.2.9", function () {
        it('should return published AOIs', function (done) {
            request({
                method: 'GET',
                url: apiUrl + '/aoi/async/0.2.9'
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 501);
                // TODO: Assert expected response
                done();
            });
        });

        it('should return all AOIs for admin users', function (done) {
            request({
                method: 'GET',
                url: apiUrl + '/aoi/async/0.2.9',
                auth: {
                    user: admin.username,
                    pass: admin.password,
                    sendImmediately: true
                }
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 501);
                // TODO: Assert expected response
                done();
            });
        });
    });

    describe("POST /aoi/async/0.2.9", function () {
        it('should allow anyone to create an AOI', function (done) {
            var aoi = {}; // TODO ceate mock AOI
            request({
                method: 'POST',
                url: apiUrl + '/aoi/async/0.2.9',
                json: aoi
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 501);
                // TODO: Assert expected response
                done();
            });
        });
    });
});
