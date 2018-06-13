function cartController(sql) {
  function getDetailAllCarts(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query(`SELECT dbo.UserWebsite.userID, dbo.UserWebsite.name AS userName, 
      dbo.Product.productID, dbo.Product.name AS productName, quantity
      FROM dbo.Cart INNER JOIN dbo.Product ON Product.productID = Cart.productID
      INNER JOIN dbo.UserWebsite ON UserWebsite.userID = Cart.userID`).then((result) => {
        const carts = result.recordset;
        res.json(carts);
        resolve(carts);
      }).catch(error => reject(error));
    });
  }
  function getViewAllCarts(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT * FROM dbo.Cart').then((result) => {
        const carts = result.recordset;
        res.json(carts);
        resolve(carts);
      }).catch(error => reject(error));
    });
  }
  function getDetailCartByUserID(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT dbo.UserWebsite.userID, dbo.UserWebsite.name AS userName, 
      dbo.Product.productID, dbo.Product.name AS productName, quantity
      FROM dbo.Cart INNER JOIN dbo.Product ON Product.productID = Cart.productID
      INNER JOIN dbo.UserWebsite ON UserWebsite.userID = Cart.userID where Cart.userID = ${id}`).then((result) => {
        const cart = result.recordset;
        res.json(cart);
        resolve(cart);
      }).catch(error => reject(error));
    });
  }
  function getViewCartByUserID(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT * FROM dbo.Cart WHERE userID = ${id}`).then((result) => {
        const cart = result.recordset;
        res.json(cart);
        resolve(cart);
      }).catch(error => reject(error));
    });
  }
  function getDetailCartByUserIDAndProductID(req, res) {
    return new Promise((resolve, reject) => {
      const { productID, userID } = req.body;
      const request = new sql.Request();
      request.query(`SELECT dbo.UserWebsite.userID, dbo.UserWebsite.name AS userName, 
      dbo.Product.productID, dbo.Product.name AS productName, quantity
      FROM dbo.Cart INNER JOIN dbo.Product ON Product.productID = Cart.productID
      INNER JOIN dbo.UserWebsite ON UserWebsite.userID = Cart.userID where Cart.userID = ${userID}
      AND Cart.productID = ${productID}`).then((result) => {
        const cart = result.recordset;
        res.json(cart);
        resolve(cart);
      }).catch(error => reject(error));
    });
  }
  function addCart(req, res) {
    return new Promise((resolve, reject) => {
      const { productID, userID, quantity } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        request.query(`INSERT INTO dbo.Cart ( productID, userID, quantity ) 
        VALUES (${productID}, ${userID}, ${quantity})`)
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
  function editCart(req, res) {
    return new Promise((resolve, reject) => {
      const { productID, userID, quantity } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        request.query(`UPDATE dbo.Cart SET quantity = ${quantity} WHERE productID = ${productID} 
        AND userID = ${userID}`)
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
  function deleteCartByUserIDAndProductID(req, res) {
    return new Promise((resolve, reject) => {
      const { productID, userID } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        request.query(`DELETE from dbo.Cart WHERE productID = ${productID} AND userID=${userID}`)
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
    getDetailAllCarts,
    getViewAllCarts,
    getDetailCartByUserID,
    getViewCartByUserID,
    getDetailCartByUserIDAndProductID,
    addCart,
    editCart,
    deleteCartByUserIDAndProductID
  };
}

module.exports = cartController;
