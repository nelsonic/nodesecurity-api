var dulcimer = require('dulcimer');
var verymodel = require('verymodel');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var async   = require('async');

var type = verymodel.VeryType;

var User = new dulcimer.Model(
{
    first_name: {
        type: new type().isAlphanumeric().len(1, 80)
    },
    last_name: {
        type: new type().isAlphanumeric().len(1, 80)
    },
    avatar : {
        derive: function (model) {
            var gravatarUri = 'http://www.gravatar.com/avatar/';
            var size = 200;
            var md5Email =
            crypto.createHash('md5').update(model.username).digest('hex');
            return gravatarUri + md5Email + '?s=' + size;
        }
    },
    password: {
        type: new type().isAlphanumeric(),
        required: true,
        onSet: function (value) {
            var salt = bcrypt.genSaltSync(10);
            var password = bcrypt.hashSync(value, salt);
            return password;
        },
        private: true
    },
    username: {
        type: new type().isEmail(),
        unique: true,
        required: true,
        index: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    id: {
        derive: function (model) {
            return model.key; //we use the key as the id
        }
    }
},
{
    prefix: 'user',
    includeKey: false,
    savePrivate: true
});

User.findByUserName = function (username, callback) {
    User.findByIndex('username', username, callback);
};

User.removeAll = function (cb) {
    User.all(function (err, dbUsers) {
        async.each(dbUsers, deleteUser, function done(err) {
            cb(err);
        });

        function deleteUser(user) {
            user.delete(function (err) {
                if (err) {
                    throw err;
                }
            });
        }
    });
};

module.exports = User;
