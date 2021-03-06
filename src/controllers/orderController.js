const debug = require('debug')('app:orderController');
const jsontoken = require('../config/jsontoken');

const { getToken, verifyToken } = jsontoken();

function orderController(sql) {
  function getDetailAllOrders(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT OrderHistory.orderID, OrderHistory.time, OrderHistory.userID, Product.productID, '
        + ' Product.name, Product.price, quantity, UserWebsite.name as username, address, phone, OrderHistory.statusID, '
        + ' statusName FROM dbo.OrderHistory INNER JOIN dbo.UserWebsite ON UserWebsite.userID = OrderHistory.userID'
        + ' INNER JOIN dbo.StatusOrder ON StatusOrder.statusID = OrderHistory.statusID INNER JOIN '
        + ' dbo.OrderItemHistory ON OrderItemHistory.orderID = OrderHistory.orderID'
        + ' INNER JOIN dbo.Product ON Product.productID = OrderItemHistory.productID').then((result) => {
        const orders = result.recordset;
        res.json(orders);
        resolve(orders);
      }).catch(error => reject(error));
    });
  }
  function getViewAllOrders(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT OrderHistory.orderID, OrderHistory.time, OrderHistory.userID, UserWebsite.name as username,'
        + ' address, phone, statusName, OrderHistory.statusID FROM'
        + ' dbo.OrderHistory INNER JOIN dbo.UserWebsite ON UserWebsite.userID = OrderHistory.userID'
        + ' INNER JOIN dbo.StatusOrder ON StatusOrder.statusID = OrderHistory.statusID').then((result) => {
        const orders = result.recordset;
        res.json(orders);
        resolve(orders);
      }).catch(error => reject(error));
    });
  }
  function getDetailOrderById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT OrderHistory.orderID, OrderHistory.time, OrderHistory.userID,Product.productID, Product.name,
      Product.price, quantity, UserWebsite.name as username, address, phone, OrderHistory.statusID,
      statusName FROM dbo.OrderHistory INNER JOIN dbo.UserWebsite ON UserWebsite.userID = OrderHistory.userID 
      INNER JOIN dbo.StatusOrder ON StatusOrder.statusID = OrderHistory.statusID INNER JOIN 
      dbo.OrderItemHistory ON OrderItemHistory.orderID = OrderHistory.orderID INNER JOIN dbo.Product
      ON Product.productID = OrderItemHistory.productID WHERE OrderHistory.orderID =${id}`).then((result) => {
        const order = result.recordset;
        res.json(order);
        resolve(order);
      }).catch(error => reject(error));
    });
  }
  function getViewOrderById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT OrderHistory.orderID, OrderHistory.time, OrderHistory.userID, UserWebsite.name as
       username, address, phone, statusName, OrderHistory.statusID FROM 
      dbo.OrderHistory INNER JOIN dbo.UserWebsite ON UserWebsite.userID = OrderHistory.userID 
      INNER JOIN dbo.StatusOrder ON StatusOrder.statusID = OrderHistory.statusID 
      WHERE OrderHistory.orderID =${id}`).then((result) => {
        const order = result.recordset;
        res.json(order);
        resolve(order);
      }).catch(error => reject(error));
    });
  }
  function getItemsOfOrderById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT orderID, time, name, Product.productID, Product.price, quantity, OrderHistory.statusID FROM dbo.OrderItemHistory INNER JOIN 
      dbo.Product ON Product.productID = OrderItemHistory.productID
       WHERE orderID =${id}`).then((result) => {
        const order = result.recordset;
        res.json(order);
        resolve(order);
      }).catch(error => reject(error));
    });
  }
  function getDetailAllOrdersByUser(req, res) {
    return new Promise((resolve, reject) => {
      getToken(req).then((token) => {
        verifyToken(token).then((user) => {
          const request = new sql.Request();
          const { email } = user;
          request.query(`SELECT OrderHistory.orderID, OrderHistory.time, OrderHistory.userID, Product.price, OrderHistory.statusID, Product.productID, Product.name, quantity, time,
          statusName FROM dbo.OrderHistory INNER JOIN dbo.UserWebsite ON UserWebsite.userID = OrderHistory.userID
          INNER JOIN dbo.StatusOrder ON StatusOrder.statusID = OrderHistory.statusID INNER JOIN
          dbo.OrderItemHistory ON OrderItemHistory.orderID = OrderHistory.orderID
          INNER JOIN dbo.Product ON Product.productID = OrderItemHistory.productID
          WHERE dbo.UserWebsite.email = '${email}'`).then((result) => {
            const orders = result.recordset;
            res.json(orders);
            resolve(orders);
          }).catch(error => reject(error));
        }, () => { res.sendStatus(403); });
      }, () => { res.sendStatus(403); });
    });
  }
  function addItemList(productID, quantity, orderID) {
    return new Promise((resolve, reject) => {
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        debug(`INSERT INTO dbo.OrderItemHistory (orderID, productID, quantity)
        VALUES (${orderID}, ${productID}, ${quantity})`);
        request.query(`INSERT INTO dbo.OrderItemHistory (orderID, productID, quantity)
        VALUES (${orderID}, ${productID}, ${quantity})`)
          .then((result) => {
            debug(result);
            resolve(result);
          }).catch((err) => {
            reject(err);
          });
      });
    });
  }
  function addOrder(req, res) {
    return new Promise((resolve, reject) => {
      const { statusID, itemList, userID } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        request.query(`INSERT INTO dbo.OrderHistory (userID, time, statusID) OUTPUT INSERTED.orderID
        VALUES (${userID}, GETDATE(), ${statusID})`)
          .then((result) => {
            const { orderID } = result.recordset[0];
            itemList.forEach((element) => {
              const { productID, quantity } = element;
              addItemList(productID, quantity, orderID);
            });
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
  function editOrder(req, res) {
    return new Promise((resolve, reject) => {
      const { userID, statusID, id } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      return transaction.begin(() => {
        request.query(`UPDATE dbo.OrderHistory SET statusID = ${statusID} WHERE orderID = ${id} AND userID = ${userID}`)
          .then((orderResult) => {
            debug(orderResult);
            transaction.commit();
            res.send(orderResult);
            resolve(orderResult);
          }).catch((err) => {
            res.send(err);
            reject(err);
          });
      });
    });
  }
  function deleteOrder(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        request.query(`DELETE dbo.OrderItemHistory WHERE orderID = ${id}
        DELETE dbo.OrderHistory WHERE orderID = ${id}`)
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
    getDetailAllOrders,
    getViewAllOrders,
    getDetailOrderById,
    getViewOrderById,
    getItemsOfOrderById,
    addOrder,
    getDetailAllOrdersByUser,
    editOrder,
    deleteOrder
  };
}

module.exports = orderController;
