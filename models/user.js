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
    roles: [{type: Schema.Types.ObjectId, ref: 'Role'}]
});
//}, { _id: false });

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

var User = function () {};

User.prototype.read = function (item, callback) {
    if (item) {
        UserModel.findOne(item, callback);
    } else {
        UserModel.find().sort({ username: -1 }).exec(callback);
    }
};

User.prototype.del = function (item, callback) {
    if (item) {
        UserModel.remove(item, callback);
    }
};

User.prototype.create = function (item, callback) {
    var newUser = new UserModel(item);
    newUser.set('password', item.password);
    newUser.save(function (err, user) {
        callback(err, user);
    });

    /*
    UserModel.findByUserName(newUser.username, function (err, user) {
        if (err) {
            logger.error('database error');
            callback(true, err);
        } else if (user.length > 0) {
            callback(true, 'Duplicate User');
        } else {
            newUser.save(function (err, user) {
                callback(err, user);
            });
        }
    })t;
    */
};

User.prototype.update = function (username, item, callback) {

    // add stuff from #577
    if (!Object.prototype.hasOwnProperty.call(item, 'password') || !item.password) {
        delete item.password;
    }

    UserModel.findOne({ username: username }, function (err, user) {
        ['username', 'first_name', 'last_name', 'password'].forEach(function (field) {
            if (typeof item[field] !== 'undefined') {
                user[field] = item[field];
            }
        });
        user.save(callback);
    });
};


//module.exports = function () {
//    return new User();
//}()
