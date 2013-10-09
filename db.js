'use strict';

var mongoose = require('mongoose');
var config = require('getconfig');
var logger = require('bucker').createLogger(config.bucker);
var mongoString = config.mongo.connect_string;

logger.debug('mongo: ' + mongoString);

var dbMongoose = mongoose.connect(mongoString);


exports.mongoose = dbMongoose;
