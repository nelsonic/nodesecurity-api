// This is using the old version of Dulcimer
var store   = require('./../store');
var User    = store.models.User;

var admin = {
  username: 'admin@nodesecurity.io',
  password: 'letmein'
};

// Create a default admin
var u = User.create({
  username: admin.username,
  admin: true
});
u.password = admin.password;

u.save(function (err) {
  console.log('Admin stored');
});