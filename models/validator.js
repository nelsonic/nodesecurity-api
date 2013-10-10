var validate = require('mongoose-validator').validate;

exports.advisory = {
    severity: [validate('regex', /^low$|^medium$|^high$|^patched$/)],
    module_name: [validate('regex', /^[a-zA-Z0-9\.\-_]+$/)],
    title: [validate('regex', /^[a-zA-Z0-9\.\-_'"!\?]+$/)],
    cve: [validate({passIfEmpty: true}, 'regex', /^[a-zA-Z0-9\.\-_]+$/)]
};

exports.user = {
    email: [validate('isEmail'), validate('notEmpty')],
    name: [validate('isAlphanumeric'), validate('notEmpty')],
    password: [validate('notEmpty')],
    username: [validate('regex', /^[a-zA-Z0-9\.\-_]+$/), validate('notEmpty')]
};

exports.generateErrorMessage = function (error) {
    var invalidFields = Object.keys(error.errors).join(', ');
    return 'Invalid fields: ' + invalidFields;
};
