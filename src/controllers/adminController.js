const debug = require('debug')('app:adminController');
const jsontoken = require('../config/jsontoken');

const { getToken, verifyToken } = jsontoken();

function adminController(sql) {
  function isUsernameNotExist(username) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query(`SELECT username, password FROM dbo.AdminWebsite WHERE
         username = '${username}'`).then((result) => {
        const adminResult = result.recordset[0];
        debug(adminResult);
        if (adminResult.username === 'undefined') {
          resolve(true);
        } else {
          reject();
        }
      }).catch(() => resolve(false));
    });
  }
  function getDetailAdmin(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then((user) => {
          const { username } = user;
          const request = new sql.Request();
          request.query(`SELECT username, image FROM dbo.AdminWebsite WHERE
            username = '${username}'`).then((result) => {
            const adminResult = result.recordset;
            debug(adminResult);
            res.send(adminResult);
            resolve(adminResult);
          }).catch(() => reject());
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function addAdmin(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then(() => {
          const { username, password, image } = req.body;
          const transaction = new sql.Transaction();
          const request = new sql.Request(transaction);
          isUsernameNotExist(username).then(() => {
            if (image) {
              transaction.begin(() => {
                request.query(`INSERT INTO dbo.AdminWebsite ( username, password, image ) 
                VALUES ('${username}', '${password}', '${image}')`)
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
                request.query(`INSERT INTO dbo.AdminWebsite ( username, password ) 
                VALUES ('${username}', '${password}')`)
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
          }, () => { res.sendStatus(403); });
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function changePassword(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then((user) => {
          debug(user);
          const { password, newPassword } = req.body;
          const { username } = user;
          const correctPassword = user.password;
          debug('abc');
          if (typeof password !== 'undefined' && password === correctPassword) {
            debug('abc');
            const transaction = new sql.Transaction();
            const request = new sql.Request(transaction);
            transaction.begin(() => {
              request.query(`UPDATE dbo.AdminWebsite SET password = '${newPassword}' WHERE 
              username= '${username}' AND password = '${password}'`)
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
            res.sendStatus(403);
          }
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function updateImage(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then((user) => {
          const { image } = req.body;
          const { username } = user;
          const transaction = new sql.Transaction();
          const request = new sql.Request(transaction);
          transaction.begin(() => {
            request.query(`UPDATE dbo.AdminWebsite SET image = '${image}' WHERE username= '${username}'`)
              .then((result) => {
                transaction.commit();
                res.send(result);
                resolve(result);
              }).catch((err) => {
                res.send(err);
                reject(err);
              });
          });
        });
      }, () => { res.sendStatus(403); });
    }, () => { res.sendStatus(403); });
  }
  function isAdminExist(admin) {
    return new Promise((resolve) => {
      const { username, password } = admin;
      const request = new sql.Request();
      request.query(`SELECT username, password FROM dbo.AdminWebsite WHERE
         username = '${username}' AND password = '${password}'`).then((result) => {
        const adminResult = result.recordset[0];
        debug(adminResult.username);
        if (typeof adminResult.username !== 'undefined') {
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch(() => resolve(false));
    });
  }
  return {
    addAdmin,
    changePassword,
    updateImage,
    isAdminExist,
    getDetailAdmin
  };
}

module.exports = adminController;
