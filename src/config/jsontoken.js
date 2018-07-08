const debug = require('debug')('app:jsontoken');
const jwt = require('jsonwebtoken');

function jsontoken() {
  const key = 'hoalacxanh';
  function signIn(res, req, user) {
    jwt.sign({ user }, key, (err, token) => {
      const msg = 'Đăng nhập thành công';
      res.json({ token, msg });
    });
  }
  function getToken(req) {
    return new Promise((resolve, reject) => {
      const { autherization } = req.headers;
      if (typeof autherization !== 'undefined') {
        const bearer = autherization.split(' ');
        const token = bearer[1];
        resolve(token);
      }
      reject();
    });
  }
  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, key, (err, authData) => {
        if (err) {
          return null;
        }
        const { user } = authData;
        resolve(user);
        return user;
      });
      reject();
    });
  }
  function validateToken(req, res, isUserExist) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then((user) => {
          if (typeof user !== 'undefined') {
            debug(user);
            isUserExist(user).then((result) => {
              debug(result);
              if (result) {
                debug(result);
                resolve(result);
              } else {
                reject(false);
              }
            });
          } else {
            reject(false);
          }
        }, () => {
          reject(false);
      });
    });
  });
}

  return {
    signIn,
    getToken,
    verifyToken,
    validateToken
  };
}

module.exports = jsontoken;
