const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./db/user');

exports.createUser = function createUser(call, cb) {
  const { username, email, password } = call.request.user;

  // hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return cb(err, null);
    }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return cb(err, null);
      }

      const usr = new User({
        username: username,
        email: email,
        password: hash,
      });
      usr.save((err, data) => {
        if (err) {
          return cb(err, null);
        }
        const response = {
          _id: data._id,
        };
        return cb(null, response);
      });
    });
  });
};

exports.getUser = function getUser(call, cb) {
  const { _id } = call.request;

  User.findOne({ _id }, (err, res) => {
    if (err) {
      return cb(err, null);
    }
    if (!res) {
      return cb(new Error('user not found'), null);
    }
    const response = {
      user: {
        username: res.username,
        email: res.email,
        _id: res._id,
      },
    };
    return cb(null, response);
  });
};

exports.createToken = function createToken(call, cb) {
  let user = call.request.user;

  // 1. query db for user with given email
  // 2. check if passwords match
  // 3. create token with id, username, and email

  User.findOne({ email: user.email }, (err, res) => {
    if (err) {
      return cb(err, null);
    } else {
      bcrypt.compare(user.password, res.password, (err, ok) => {
        if (err) {
          return cb(err, null);
        }
        if (ok) {
          user._id = res._id;
          user.username = res.username;
          user.email = res.email;
          jwt.sign(user, 'SECRET', (err, token) => {
            if (err) {
              return cb(err, null);
            }
            const response = {
              token,
            };
            return cb(null, response);
          });
        }
        return cb(new Error('incorrect password'), null);
      });
    }
  });
};

exports.isAuthenticated = function IsAuthenticated(call, cb) {
  const token = call.request.token;

  jwt.verify(token, 'SECRET', (err, user) => {
    if (err) return cb(err, { ok: false });
    else {
      const response = {
        ok: true,
        user: user,
      };
      return cb(null, response);
    }
  });
};
