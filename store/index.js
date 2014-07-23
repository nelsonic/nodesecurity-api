var dulcimer = require('dulcimer');
var config   = require('config');

if (process.env.NODE_ENV !== 'PROD') {
  dulcimer.connect({
    type: 'level',
    path: config.db,
    bucket: 'defaultbucket'
  });  
} else {
  // Connect to Riak
}

module.exports.models = {
  User: require('./models/user.js'),
  Report: require('./models/report.js')
  // add more models here
};