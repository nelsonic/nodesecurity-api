var dulcimer    = require('dulcimer');
var verymodel   = require('verymodel');
var crypto      = require('crypto');

var type = verymodel.VeryType;

var options = {
  name: 'report',
  includeKey: false,
  savePrivate: true
};

var Report = new dulcimer.Model({

  reporter_username: {
    type: new type().isEmail(),
    required: true,
    index: true
  },
  module_name: {
    type: 'string',
    index: true
  },
  module_version: {
    type: 'string'
  },
  report_id: {
    onSet: function (value) {
      var md5NameVersionDate =
      crypto.createHash('md5').update(
        this.module_name +
        this.module_version +
        Date.now().toString()
        ).digest('hex');
      return md5NameVersionDate;
    },
    index: true
  },
  description: {
    type: 'string'
  },
  how_to_replicate: {
    type: 'string'
  },
  gist: {
    type: 'string'
  },
  other_links: {
    type: 'string'
  },
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