'use strict';

var bcrypt = require('bcrypt');
var config = require('config');
var logger = require('bucker').createLogger(config.bucker);
var crypto = require('crypto');

var mongoose = require('../db.js').mongoose,
    validator = require('./validator').user;

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    first_name: {type: String, validate: validator.name},
    last_name:  {type: String, validate: validator.name},
    password:   {type: String, required: true, validate: validator.password},
    username:   {type: String, unique: true, required: true, validate: validator.email},
    admin: {type: Boolean, default: false}
});

UserSchema.statics.findByUserName = function (username, callback) {
    this.find({ username: new RegExp(username, 'i') }, callback);
};

UserSchema.virtual('avatar').get(function () {
    var gravatarUri = 'http://www.gravatar.com/avatar/';
    var size = 200;
    var md5Email = crypto.createHash('md5').update(this.username).digest('hex');
    return gravatarUri + md5Email + '?s=' + size;
});

UserSchema.path('password').set(function (value) {
    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(value, salt);
    return password;
});

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
