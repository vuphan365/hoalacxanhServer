const debug = require('debug')('app:jsontoken');
const jwt = require('jsonwebtoken');

function jsontoken() {
  const key = 'hoalacxanh';
  function signIn(res, req, user) {
    jwt.sign({ user }, key, (err, token) => {
      debug(token);
      res.json(token);
    });
  }
  function getToken(req) {
    return new Promise((resolve, reject) => {
      const { autherization } = req.headers;
      debug(autherization);
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
  function validateToken(req, res, next, isUserExist) {
    getToken(req).then((token) => {
      verifyToken(token).then((user) => {
        if (typeof user !== 'undefined') {
          isUserExist(user).then((result) => {
            if (result) {
              debug(result);
              next();
            } else {
              res.sendStatus(403);
            }
          });
        } else {
          res.sendStatus(403);
        }
      }, () => { res.sendStatus(403); });
    }, () => { res.sendStatus(403); });
  }
  return {
    signIn,
    getToken,
    verifyToken,
    validateToken
  };
}

module.exports = jsontoken;
