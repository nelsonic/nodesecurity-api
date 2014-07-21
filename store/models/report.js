var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var crypto = require('crypto');

var type = verymodel.VeryType;

var options = {
    prefix: 'report',
    includeKey: false,
    savePrivate: true
};

var Report = new dulcimer.Model({

    reporter_username: {
        type: new type().isEmail(),
        unique: true,
        required: true,
        index: true
    },
    module_name: {
        //TODO: Check if there is modules with more than 80 chars
        type: new type().isAlphanumeric().len(1, 80)
    },
    module_version: {

    },
    report_id: {
        derive: function (model) {
            var md5NameVersionDate =
            crypto.createHash('md5').update(
                model.module_name +
                model.module_version +
                Date.now().toString() 
                ).digest('hex');
            return md5NameVersionDate;
        }
    },
    description: {
        type: new type().isAlphanumeric()
    },
    gist: {
        type: new type().isURL()
    }
}, options);

Report.findByReportID = function (reportId, callback) {
    Report.findByIndex('report_id', reportId, callback);
};

Report.findByReporterUsername = function (reporterUsername, callback) {
    Report.findByIndex('reporter_username', reporterUsername, callback);
};

Report.findByModuleName = function (moduleName, callback) {
    Report.findByIndex('module_name', moduleName, callback);
};

module.exports = Report;