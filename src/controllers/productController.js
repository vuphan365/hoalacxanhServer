
function productController(sql) {
  function getDetailAllProducts(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT productID, name, price, image, content, typeName FROM dbo.Product'
      + ' INNER JOIN dbo.TypeProduct ON TypeProduct.typeID = Product.typeID').then((result) => {
        const products = result.recordset;
        res.json(products);
        resolve(products);
      }).catch(error => reject(error));
    });
  }
  function getViewAllProducts(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT productID, name, price, image, typeName FROM dbo.Product'
      + ' INNER JOIN dbo.TypeProduct ON TypeProduct.typeID = Product.typeID').then((result) => {
        const products = result.recordset;
        res.json(products);
        resolve(products);
      }).catch(error => reject(error));
    });
  }
  function getDetailProductById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT productID, name, price, image, content, typeName FROM dbo.Product 
      INNER JOIN dbo.TypeProduct ON TypeProduct.typeID = Product.typeID WHERE productID=${id}`).then((result) => {
        const product = result.recordset;
        res.json(product);
        resolve(product);
      }).catch(error => reject(error));
    });
  }
  function getViewProductById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT productID, name, price, image, typeName FROM dbo.Product 
      INNER JOIN dbo.TypeProduct ON TypeProduct.typeID = Product.typeID WHERE productID=${id}`).then((result) => {
        const product = result.recordset;
        res.json(product);
        resolve(product);
      }).catch(error => reject(error));
    });
  }
  function getContentProductById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT content FROM dbo.Product INNER JOIN dbo.TypeProduct
      ON TypeProduct.typeID = Product.typeID WHERE productID=${id}`).then((result) => {
        const product = result.recordset;
        res.json(product);
        resolve(product);
      }).catch(error => reject(error));
    });
  }
  function addProduct(req, res) {
    return new Promise((resolve, reject) => {
      const { name, price, image, content, typeID } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      if (image) {
        transaction.begin(() => {
          request.query(`INSERT INTO dbo.Product (name, price, image, content, typeID)
          VALUES (N'${name}', ${price}, '${image}',N'${content}', ${typeID})`)
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
          request.query(`INSERT INTO dbo.Product (name, price, content, typeID)
          VALUES (N'${name}', ${price}, N'${content}', ${typeID})`)
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
  function editProduct(req, res) {
    return new Promise((resolve, reject) => {
      const productID = req.params.id;
      const { name, price, image, content, typeID } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      if (image) {
        transaction.begin(() => {
          request.query(`UPDATE dbo.Product SET name = N'${name}', price = ${price}, image = '${image}',
           content = N'${content}', typeID = ${typeID} WHERE productID = ${productID}`)
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
          request.query(`UPDATE dbo.Product SET name = N'${name}', price = ${price},
          content = N'${content}', typeID = ${typeID} WHERE productID = ${productID}`)
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
  function deleteProductById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        request.query(`DELETE from dbo.Product WHERE productID = ${id}`)
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
    getDetailAllProducts,
    getViewAllProducts,
    getDetailProductById,
    getViewProductById,
    getContentProductById,
    addProduct,
    editProduct,
    deleteProductById
  };
}

module.exports = productController;
