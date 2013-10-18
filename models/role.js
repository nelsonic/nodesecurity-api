'use strict';

var config = require('config');
var logger = require('bucker').createLogger(config.bucker);

var mongoose = require('../db.js').mongoose,
    validator = require('./validator').user;

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var RoleSchema = new Schema({
    _creator: {type: Schema.Types.ObjectId, ref: 'User'},
    role: [String]
});

var RoleModel = mongoose.model('Role', RoleSchema);
module.exports = RoleModel;


