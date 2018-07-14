const express = require('express');

const cartRouter = express.Router();
const cartController = require('../controllers/cartController');
const userController = require('../controllers/userController');
const jsontoken = require('../config/jsontoken');

function router(sql) {
  const { getDetailAllCarts, getViewAllCarts, getDetailCartByUserID, getViewCartByUserID, addCart,
    getDetailCartByUserIDAndProductID, editCart, deleteCartByUserIDAndProductID, getViewCartOfUser }
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
  cartRouter.route('/me')
    .get((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        getViewCartOfUser(req, res);
      }).catch(() => res.sendStatus(403));
    });
  cartRouter.route('/add')
    .post((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        addCart(req, res);
      }).catch(() => res.sendStatus(403));
    });
  cartRouter.route('/get')
    .get((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        getDetailCartByUserIDAndProductID(req, res);
      }).catch(() => res.sendStatus(403));
    });

  cartRouter.route('/edit')
    .post((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        editCart(req, res);
      }).catch(() => res.sendStatus(403));
    });
  cartRouter.route('/delete')
    .post((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        deleteCartByUserIDAndProductID(req, res);
      }).catch(() => res.sendStatus(403));
    });
  return cartRouter;
}
module.exports = router;
