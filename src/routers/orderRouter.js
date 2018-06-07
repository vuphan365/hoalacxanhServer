const express = require('express');

const orderRouter = express.Router();
const orderController = require('../controllers/orderController');

function router(sql) {
  const { getDetailAllOrders, getDetailOrderById, getViewOrderById, addOrder,
    getViewAllOrders, getItemsOfOrderById, getDetailAllOrdersByUserID, editOrder, deleteOrderById }
    = orderController(sql);
  orderRouter.route('/detail')
    .get(getDetailAllOrders);
  orderRouter.route('/user/:id')
    .get(getDetailAllOrdersByUserID);
  orderRouter.route('/detail/:id')
    .get(getDetailOrderById);
  orderRouter.route('/view')
    .get(getViewAllOrders);
  orderRouter.route('/view/:id')
    .get(getViewOrderById);
  orderRouter.route('/view/:id/items')
    .get(getItemsOfOrderById);
  orderRouter.route('/add')
    .post(addOrder);
  orderRouter.route('/edit/:id')
    .post(editOrder);
  orderRouter.route('/delete/:id')
    .get(deleteOrderById);
  return orderRouter;
}

module.exports = router;
