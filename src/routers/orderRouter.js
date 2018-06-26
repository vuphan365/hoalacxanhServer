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
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(getDetailAllOrders);
  orderRouter.route('/user')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .get(getDetailAllOrdersByUser);
  orderRouter.route('/detail/:id')
    .get(getDetailOrderById);
  orderRouter.route('/view')
    .get(getViewAllOrders);
  orderRouter.route('/view/:id')
    .get(getViewOrderById);
  orderRouter.route('/view/:id/items')
    .get(getItemsOfOrderById);
  orderRouter.route('/add')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .post(addOrder);
  orderRouter.route('/edit')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .post(editOrder);
  orderRouter.route('/delete')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(deleteOrder);
  return orderRouter;
}

module.exports = router;
