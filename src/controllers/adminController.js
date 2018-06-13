function adminController(sql) {
  function signIn(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      const { username, password } = req.body;
      request.query(`SELECT username, image FROM dbo.AdminWebsite WHERE 
      username = '${username}' AND password = '${password}'`).then((result) => {
        const admin = result.recordset;
        res.json(admin);
        resolve(admin);
      }).catch(error => reject(error));
    });
  }
  function addAdmin(req, res) {
    return new Promise((resolve, reject) => {
      const { username, password, image } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      if (image) {
        transaction.begin(() => {
          request.query(`INSERT INTO dbo.AdminWebsite ( username, password, image ) 
          VALUES ('${username}', '${password}', ${image})`)
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
    });
  }
  function changePassword(req, res) {
    return new Promise((resolve, reject) => {
      const { username, password, newPassword } = req.body;
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
    });
  }
  function updateImage(req, res) {
    return new Promise((resolve, reject) => {
      const { username, image } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        request.query(`UPDATE dbo.AdminWebsite SET image = ${image} WHERE username= '${username}'`)
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
  }
  return {
    signIn,
    addAdmin,
    changePassword,
    updateImage
  };
}

module.exports = adminController;
