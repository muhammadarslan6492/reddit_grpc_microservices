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

      User.create(
        { username: username, email: email, password: hash },
        (err, res) => {
          if (err) {
            return cb(err, null);
          }
          const response = {
            id: res.rows[0].id,
          };
          return cb(null, response);
        }
      );
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

  client.query(
    'select id, username, password from users where email = $1',
    [user.email],
    (err, res) => {
      if (err) {
        return cb(err, null);
      } else {
        bcrypt.compare(user.password, res.rows[0].password, (err, ok) => {
          if (err) return cb(err, null);
          if (ok) {
            user.id = res.rows[0].id;
            user.username = res.rows[0].username;
            jwt.sign(user, 'SECRET', (err, token) => {
              if (err) return cb(err, null);
              const response = {
                token,
              };
              return cb(null, response);
            });
          }
          if (!ok) {
            return cb(new Error('incorrect password'), null);
          }
        });
      }
    }
  );
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

// const salt = 10;
// exports.createUser = async function createUser(call) {
//   const { user } = call.request;
//   // hash user password
//   const hash = bcrypt.hash(user.password, hash);
//   user.password = hash;
//   //create user in db
//   const usr = await User.craete(user);
//   // return response
//   const response = { _id: usr._id };
//   return response;
// };

// exports.getUser = async function (call) {
//   const { _id } = call.request;
//   const response = await User.findOne({ _id });
//   if (!response) {
//     throw new Error('user not exist with this id');
//   }
//   return response;
// };

// exports.createToken = async function (call) {
//   const { user } = call.request;
//   const usr = await User.findOne({ email: user.email });
//   if (!usr) {
//     throw new Error('email or password Incorrect');
//   }
//   const match = await bcrypt.compare(user.password, usr.password);
//   if (match) {
//     throw new Error('email or password Incorrect');
//   }
//   const tokenDate = {
//     _id: usr._id,
//     username: usr.username,
//     email: usr.email,
//   };
//   const token = jwt.sign(tokenDate, 'dafsdasdasdasd');
//   const response = { ...token };
//   return response;
// };

// exports.isAuthenticated = function IsAuthenticated(call, cb) {
//   const token = call.request.token;

//   jwt.verify(token, 'dafsdasdasdasd', (err, user) => {
//     if (err) return cb(err, { ok: false });
//     else {
//       const response = {
//         ok: true,
//         user: user,
//       };
//       return cb(null, response);
//     }
//   });
// };
