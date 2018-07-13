const debug = require('debug')('app:userController');
const jsontoken = require('../config/jsontoken');

const { getToken, verifyToken } = jsontoken();

function userController(sql) {
  function getDetailAllUsers(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT * FROM dbo.UserWebsite').then((result) => {
        const users = result.recordset;
        res.json(users);
        resolve(users);
      }).catch(error => reject(error));
    });
  }
  function getViewAllUsers(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT userID, name, email, address, phone FROM dbo.UserWebsite').then((result) => {
        const users = result.recordset;
        res.json(users);
        resolve(users);
      }).catch(error => reject(error));
    });
  }
  function getDetailUser(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then((user) => {
          const { email } = user;
          const request = new sql.Request();
          request.query(`SELECT * FROM dbo.UserWebsite WHERE email ='${email}'`).then((result) => {
            const userResult = result.recordset;
            res.json(userResult);
            resolve(userResult);
          }).catch(error => reject(error));
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function getDetailUserById(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then(() => {
          const { id } = req.params;
          const request = new sql.Request();
          request.query(`SELECT * FROM dbo.UserWebsite WHERE userID =${id}`).then((result) => {
            const userResult = result.recordset;
            res.json(userResult);
            resolve(userResult);
          }).catch(error => reject(error));
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function getViewUserById(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then(() => {
          const { id } = req.params;
          const request = new sql.Request();
          request.query(`SELECT userID, name, email, address, phone FROM dbo.UserWebsite WHERE userID =${id}`).then((result) => {
            const userResult = result.recordset;
            res.json(userResult);
            resolve(userResult);
          }).catch(error => reject(error));
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function getViewUser(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then((user) => {
          const { email } = user;
          const request = new sql.Request();
          request.query(`SELECT userID, name, email, address, phone FROM dbo.UserWebsite WHERE email ='${email}'`).then((result) => {
            const userResult = result.recordset;
            debug(result);
            res.json(userResult);
            resolve(userResult);
          }).catch(error => reject(error));
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function getDetailUserByEmail(req, res) {
    return new Promise((resolve, reject) => {
      const { email } = req.body;
      const request = new sql.Request();
      request.query(`SELECT * FROM dbo.UserWebsite WHERE email ='${email}'`).then((result) => {
        const user = result.recordset;
        res.json(user);
        resolve(user);
      }).catch(error => reject(error));
    });
  }
  function addUser(req, res) {
    return new Promise((resolve, reject) => {
      const { name, image, email } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      if (image) {
        transaction.begin(() => {
          request.query(`INSERT INTO dbo.UserWebsite (name, image, email)
          VALUES (N'${name}', '${image}',N'${email}')`)
            .then((result) => {
              transaction.commit();
              res.send(result);
              resolve(result);
            }).catch((err) => {
              res.send(err);
              reject(err);
            });
        });
      } else {
        transaction.begin(() => {
          request.query(`INSERT INTO dbo.UserWebsite (name, email)
           VALUES (N'${name}',N'${email}')`)
            .then((result) => {
              transaction.commit();
              res.send(result);
              resolve(result);
            }).catch((err) => {
              res.send(err);
              reject(err);
            });
        });
      }
    });
  }
  function editUser(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then((user) => {
          const { name, address, phone } = req.body;
          const { email } = user;
          const transaction = new sql.Transaction();
          const request = new sql.Request(transaction);
          transaction.begin(() => {
            request.query(`UPDATE dbo.UserWebsite SET name = N'${name}',address = N'${address}',
            phone = N'${phone}' WHERE email = N'${email}'`)
              .then((result) => {
                transaction.commit();
                res.send(result);
                resolve(result);
              }).catch((err) => {
                res.send(err);
                reject(err);
              });
          });
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function isUserExist(user) {
    return new Promise((resolve) => {
      const { email } = user;
      const request = new sql.Request();
      request.query(`SELECT email FROM dbo.UserWebsite WHERE
         email = '${email}'`).then((result) => {
        const userResult = result.recordset[0];
        debug(userResult);
        if (userResult.email !== null) {
          debug('ABC');
          resolve(true);
        }
        resolve(false);
      }).catch(() => resolve(false));
    });
  }
  return {
    getDetailAllUsers,
    getViewAllUsers,
    getDetailUserById,
    getViewUserById,
    addUser,
    editUser,
    getDetailUserByEmail,
    isUserExist,
    getViewUser,
    getDetailUser
  };
}

module.exports = userController;
