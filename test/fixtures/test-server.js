var spawn   = require('child_process').spawn;
// var store   = require('./../../store')
// store.attachDB();
// var User    = store.models.User;
var admin   = require('./logins/admin');

var serverProc = null;

module.exports = {
    /**
     * Start a test API server to test against
     */
    start: function (cb) {
        if (serverProc) { return cb(new Error('API server already started')); }

        var cwd = __dirname + '/../../';

        serverProc = spawn(process.execPath, [cwd + 'server.js'], {cwd: cwd, env: {NODE_ENV: process.env.NODE_ENV}});

        serverProc.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        serverProc.stderr.on('data', function (data) {
            console.error(data.toString());
        });

        serverProc.on('close', function (code) {
            console.log('Test API server exited with code ' + code);
        });

        if (!serverProc || !serverProc.pid) {
            return cb(new Error('Failed to start test API server'));
        }

        // Because of level being a file that gets locked, we can't have
        // two processes accessing it
        // Create a default admin
        // var u = User.create({
        //     username: admin.username,
        //     password: admin.password,
        //     admin: true
        // });

        // u.save(function () {
        //     setTimeout(function () { cb(); }, 1000);
        // });

        // Give the server a second to come up
    },
    /**
     * Stop the currently started test API server
     */
    stop: function (cb) {
        if (!serverProc) { return cb(new Error('API server not started')); }
        serverProc.kill();
        serverProc = null;
        cb();
    },
    /**
     * Wipe the test server's database
     */
    wipe: function (cb) {
        // User.remove({}, cb);
        User.removeAll(cb);
    }
};
