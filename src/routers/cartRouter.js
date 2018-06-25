const express = require('express');

const cartRouter = express.Router();
const cartController = require('../controllers/cartController');
const userController = require('../controllers/userController');
const jsontoken = require('../config/jsontoken');

function router(sql) {
  const { getDetailAllCarts, getViewAllCarts, getDetailCartByUserID, getViewCartByUserID, addCart,
    getDetailCartByUserIDAndProductID, editCart, deleteCartByUserIDAndProductID }
    = cartController(sql);
  const { validateToken } = jsontoken();
  const { isUserExist } = userController(sql);
  cartRouter.route('/detail')
    .get(getDetailAllCarts);
  cartRouter.route('/detail/:id')
    .get(getDetailCartByUserID);
  cartRouter.route('/view')
    .get(getViewAllCarts);
  cartRouter.route('/view/:id')
    .get(getViewCartByUserID);
  cartRouter.route('/add')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .post(addCart);
  cartRouter.route('/get')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .post(getDetailCartByUserIDAndProductID);
  cartRouter.route('/edit')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .post(editCart);
  cartRouter.route('/delete')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .post(deleteCartByUserIDAndProductID);
  return cartRouter;
}
module.exports = router;
