const express = require('express');

const orderRouter = express.Router();
const orderController = require('../controllers/orderController');
const jsontoken = require('../config/jsontoken');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

function router(sql) {
  const { getDetailAllOrders, getDetailOrderById, getViewOrderById, addOrder,
    getViewAllOrders, getItemsOfOrderById, getDetailAllOrdersByUser, editOrder, deleteOrder }
    = orderController(sql);
  const { isAdminExist } = adminController(sql);
  const { validateToken } = jsontoken();
  const { isUserExist } = userController(sql);
  orderRouter.route('/detail')
    .get((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        getDetailAllOrders(req, res);
      }).catch(() => res.sendStatus(403));
    });
  orderRouter.route('/user')
    .get((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        getDetailAllOrdersByUser(req, res);
      }).catch(() => res.sendStatus(403));
    });
  orderRouter.route('/detail/:id')
    .get(getDetailOrderById);
  orderRouter.route('/view')
    .get(getViewAllOrders);
  orderRouter.route('/view/:id')
    .get(getViewOrderById);
  orderRouter.route('/view/:id/items')
    .get(getItemsOfOrderById);
  orderRouter.route('/add')
    .post((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        addOrder(req, res);
      }).catch(() => res.sendStatus(403));
    });
  orderRouter.route('/edit')
    .post((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        editOrder(req, res);
      }).catch(() => {
        validateToken(req, res, isAdminExist).then(() => {
          editOrder(req, res);
        }).catch(() => res.sendStatus(403));
      });
    });
  orderRouter.route('/delete')
    .post((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        deleteOrder(req, res);
      }).catch(() => {
        validateToken(req, res, isAdminExist).then(() => {
          deleteOrder(req, res);
        }).catch(() => res.sendStatus(403));
      });
    });
  return orderRouter;
}

module.exports = router;
