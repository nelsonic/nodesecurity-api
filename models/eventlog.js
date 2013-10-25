'use strict';

var config = require('config');
var logger = require('bucker').createLogger(config.bucker);

var mongoose = require('../db.js').mongoose,
    validator = require('./validator').user;

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EventLogSchema = new Schema({
    created_date: { type: Date, default: new Date().getTime() },
    plugin_name: { type: String, required: true },
    plugin_version: { type: String, required: true },
    module_name: { type: String, required: true },
    module_version: { type: String, required: true },
    match: { type: Boolean, default: false, required: true },
    title: { type: String },
    instruction: { type: String },
    code: { type: String },
    file_path: { type: String },
    line_num: { type: Number } 
});


var EventLogModel = mongoose.model('EventLog', EventLogSchema);
module.exports = EventLogModel;

var EventLog = function () {};

EventLog.prototype.read = function (item, callback) {
};

EventLog.prototype.create = function (item, callback) {
    var newEventLog = new EventLogModel(item);
    newEventLog.save(function (err, event_log) {
        callback(err, event_log);
    });
};

EventLog.prototype.update = function (username, item, callback) {
};

