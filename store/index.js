var level   = require('level');
var db;      // = level('./db', { valueEncoding: 'json' });

var models = {
    User: require('./models/User')
    // add more models here
};

function attachDB() {
    db = level('./db', { valueEncoding: 'json' });
    Object.keys(models).forEach(function (modelname) {
        models[modelname].options.db = db;
    });
}

module.exports = {
    models: models,
    attachDB: attachDB
};