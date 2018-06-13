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
  function getDetailUserById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT * FROM dbo.UserWebsite WHERE userID =${id}`).then((result) => {
        const user = result.recordset;
        res.json(user);
        resolve(user);
      }).catch(error => reject(error));
    });
  }
  function getViewUserById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT userID, name, email, address, phone FROM dbo.UserWebsite WHERE userID =${id}`).then((result) => {
        const user = result.recordset;
        res.json(user);
        resolve(user);
      }).catch(error => reject(error));
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
          request.query(`INSERT INTO dbo.Blog (name, email)
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
      const { name, email, address, phone } = req.body;
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
    });
  }
  return {
    getDetailAllUsers,
    getViewAllUsers,
    getDetailUserById,
    getViewUserById,
    addUser,
    editUser,
    getDetailUserByEmail
  };
}

module.exports = userController;
