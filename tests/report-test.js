var Hapi    = require('hapi');
var config  = require('config');
var bcrypt  = require('bcrypt');
var store   = require('./../store');
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

exports['Register the Report Plugin'] = function (test) {
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

        server.pack.register(require('./../plugins/report'), {}, function (err) {
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

   // describe('GET /reports/async/0.2.9', function () {
   //      it('should return published reports', function (done) {
   //          request({
   //              method: 'GET',
   //              url: apiUrl + '/reports/async/0.2.9'
   //          }, function (err, response, body) {
   //              assert.ifError(err);
   //              assert.equal(response.statusCode, 501);
   //              // TODO: Assert expected response
   //              done();
   //          });
   //      });

   //      it('should return all reports for admin users', function (done) {
   //          request({
   //              method: 'GET',
   //              url: apiUrl + '/reports/async/0.2.9',
   //              auth: {
   //                  user: admin.username,
   //                  pass: admin.password,
   //                  sendImmediately: true
   //              }
   //          }, function (err, response, body) {
   //              assert.ifError(err);
   //              assert.equal(response.statusCode, 501);
   //              // TODO: Assert expected response
   //              done();
   //          });
   //      });
   //  });

   //  describe('POST /report', function () {
   //      it('should disallow unauthenticated users to create a report', function (done) {
   //          var report = {module_name: 'async', module_version: '0.2.9'};
   //          request({
   //              method: 'POST',
   //              url: apiUrl + '/report',
   //              json: report
   //          }, function (err, response, body) {
   //              assert.ifError(err);
   //              assert.equal(response.statusCode, 401);
   //              done();
   //          });
   //      });

   //      it('should disallow non-admin users to create a report', function (done) {
   //          var report = {module_name: 'async', module_version: '0.2.9'}; // TODO ceate mock report
   //          request({
   //              method: 'POST',
   //              url: apiUrl + '/report',
   //              json: report,
   //              auth: {
   //                  user: user1.username,
   //                  pass: user1.password,
   //                  sendImmediately: true
   //              }
   //          }, function (err, response, body) {
   //              assert.ifError(err);
   //              assert.equal(response.statusCode, 501);
   //              // TODO: Assert expected response
   //              done();
   //          });
   //      });

   //      it('should allow admin users to create a report', function (done) {
   //          var report = {module_name: 'async', module_version: '0.2.9'}; // TODO ceate mock report
   //          request({
   //              method: 'POST',
   //              url: apiUrl + '/report',
   //              json: report,
   //              auth: {
   //                  user: admin.username,
   //                  pass: admin.password,
   //                  sendImmediately: true
   //              }
   //          }, function (err, response, body) {
   //              assert.ifError(err);
   //              assert.equal(response.statusCode, 501);
   //              // TODO: Assert expected response
   //              done();
   //          });
   //      });
   //  });

   //  describe('PUT /report/{report_id}', function () {
   //      it('should disallow unauthenticated users to update a report', function (done) {
   //          var report = {module_name: 'async', module_version: '0.2.9'};
   //          request({
   //              method: 'PUT',
   //              url: apiUrl + '/report/' + report._id,
   //              json: report
   //          }, function (err, response, body) {
   //              assert.ifError(err);
   //              assert.equal(response.statusCode, 401);
   //              done();
   //          });
   //      });

   //      it('should disallow non-admin users to update a report', function (done) {
   //          var report = {module_name: 'async', module_version: '0.2.9'}; // TODO ceate mock report
   //          request({
   //              method: 'PUT',
   //              url: apiUrl + '/report/' + report._id,
   //              json: report,
   //              auth: {
   //                  user: user1.username,
   //                  pass: user1.password,
   //                  sendImmediately: true
   //              }
   //          }, function (err, response, body) {
   //              assert.ifError(err);
   //              assert.equal(response.statusCode, 501);
   //              // TODO: Assert expected response
   //              done();
   //          });
   //      });

   //      it('should allow admin users to update a report', function (done) {
   //          var report = {module_name: 'async', module_version: '0.2.9'};
   //          request({
   //              method: 'PUT',
   //              url: apiUrl + '/report/' + report._id,
   //              json: report,
   //              auth: {
   //                  user: admin.username,
   //                  pass: admin.password,
   //                  sendImmediately: true
   //              }
   //          }, function (err, response, body) {
   //              assert.ifError(err);
   //              assert.equal(response.statusCode, 501);
   //              // TODO: Assert expected response
   //              done();
   //          });
   //      });
   //  });