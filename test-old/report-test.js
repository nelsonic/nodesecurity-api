var assert = require('assert');
var request = require('request');
var config = require('config');
var testServer = require('./fixtures/test-server');
var apiUrl = 'http://' + config.host + ':' + config.port;

var admin = require('./fixtures/logins/admin');
var user1 = require('./fixtures/logins/user1');

describe('Node Security API - vulnerability report', function () {

    /**
     * Before all tests in this suite, start a test server and wipe the DB
     */
    before(function (done) {
        testServer.wipe(function (er) {
            if (er) { throw er; }
            testServer.start(function (er) {
                if (er) { throw er; }
                console.log('Testing API at', apiUrl);

                // Create user1 in the database
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
                    user1._id = body._id;
                    done();
                });
            });
        });
    });

    /**
     * After all tests in this suite, stop the test server
     */
    after(function (done) {
        testServer.stop(function (er) {
            if (er) { throw er; }
            delete user1._id;
            done();
        });
    });

    describe('GET /reports/async/0.2.9', function () {
        it('should return published reports', function (done) {
            request({
                method: 'GET',
                url: apiUrl + '/reports/async/0.2.9'
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 501);
                // TODO: Assert expected response
                done();
            });
        });

        it('should return all reports for admin users', function (done) {
            request({
                method: 'GET',
                url: apiUrl + '/reports/async/0.2.9',
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

    describe('POST /report', function () {
        it('should disallow unauthenticated users to create a report', function (done) {
            var report = {module_name: 'async', module_version: '0.2.9'};
            request({
                method: 'POST',
                url: apiUrl + '/report',
                json: report
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });

        it('should disallow non-admin users to create a report', function (done) {
            var report = {module_name: 'async', module_version: '0.2.9'}; // TODO ceate mock report
            request({
                method: 'POST',
                url: apiUrl + '/report',
                json: report,
                auth: {
                    user: user1.username,
                    pass: user1.password,
                    sendImmediately: true
                }
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 501);
                // TODO: Assert expected response
                done();
            });
        });

        it('should allow admin users to create a report', function (done) {
            var report = {module_name: 'async', module_version: '0.2.9'}; // TODO ceate mock report
            request({
                method: 'POST',
                url: apiUrl + '/report',
                json: report,
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

    describe('PUT /report/{report_id}', function () {
        it('should disallow unauthenticated users to update a report', function (done) {
            var report = {module_name: 'async', module_version: '0.2.9'};
            request({
                method: 'PUT',
                url: apiUrl + '/report/' + report._id,
                json: report
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 401);
                done();
            });
        });

        it('should disallow non-admin users to update a report', function (done) {
            var report = {module_name: 'async', module_version: '0.2.9'}; // TODO ceate mock report
            request({
                method: 'PUT',
                url: apiUrl + '/report/' + report._id,
                json: report,
                auth: {
                    user: user1.username,
                    pass: user1.password,
                    sendImmediately: true
                }
            }, function (err, response, body) {
                assert.ifError(err);
                assert.equal(response.statusCode, 501);
                // TODO: Assert expected response
                done();
            });
        });

        it('should allow admin users to update a report', function (done) {
            var report = {module_name: 'async', module_version: '0.2.9'};
            request({
                method: 'PUT',
                url: apiUrl + '/report/' + report._id,
                json: report,
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
});
