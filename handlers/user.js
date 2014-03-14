var User = require('../models/user');
var config = require('config');
var logger = require('bucker').createLogger(config.bucker, module);
var Hapi   = require('hapi');

/**
 *	Get a list of users
 */
exports.getBatch = function (request, reply) {
	var self = this;

	if (!request.auth.credentials.user.admin) {
		return reply(Hapi.error.unauthorized('go away'));
	}

	User.find().select('-password').exec(function (err, users) {
		if (err) {
			return reply(Hapi.error.internal('User lookup failed', err));
		}
		reply(users);
	});
};

/**
 *	Get one user
 */
exports.get = function (request, reply) {
	var self = this;

	User.findOne({_id: request.params.user_id}).select('-password').exec(function (err, user) {
		if (err) {
			return reply(Hapi.error.internal('User lookup failed', err));
		}

		if (request.auth.credentials.user.admin || user.username === request.auth.credentials.user.username) {
			reply(user);
		} else {
			reply(Hapi.error.unauthorized('go away'));
		}
	});
};

/**
 *	Create a user
 */
exports.create = function (request, reply) {
	var self = this;

	logger.debug('POST /user ');
	if (!request.auth.credentials.user.admin) {
		return reply(Hapi.error.unauthorized('go away'));
	}

	User.create(request.payload, function (err, user) {
		if (err) {
			logger.error('User creation failed ' + err);
			return reply(Hapi.error.internal(err));
		}
		reply({_id: user.id}).code(201);
	});
};

/**
 *	Update a user
 */
exports.update = function (request, reply) {
	var self = this;

	User.findOne({_id: request.params.user_id}).select('-password').exec(function (err, user) {
		if (err) {
			return reply(Hapi.error.notFound(Error('User not found')));
		}

		if (request.auth.credentials.user.admin || user.username === request.auth.credentials.user.username) {
			Object.keys(request.payload).forEach(function (key) {
				user[key] = request.payload[key];
			});
			user.save();
			reply(user);
		} else {
			reply(Hapi.error.unauthorized('go away'));
		}
	});
};

/**
 *	Remove a user
 */
exports.remove = function (request, reply) {
	var self = this;

	// Only admin can delete
	if (!request.auth.credentials.user.admin) {
		return reply(Hapi.error.unauthorized('go away'));
	}

	User.remove({_id: request.params.user_id}, function (err, user) {
		if (err) {
			return reply(Hapi.error.internal('User delete failed', err));
		}
		reply();
	});
};
