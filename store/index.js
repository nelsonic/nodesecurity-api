var dulcimer = require('dulcimer');
var config  = require('config');

dulcimer.connect({
    type: 'level',
    path: config.db,
    bucket: 'defaultbucket'
});


module.exports.models = {
    User: require('./models/User')
    // add more models here
};