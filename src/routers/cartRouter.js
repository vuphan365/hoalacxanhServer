const express = require('express');

const cartRouter = express.Router();
const cartController = require('../controllers/cartController');

function router(sql) {
  const { getDetailAllCarts, getViewAllCarts, getDetailCartByUserID, getViewCartByUserID, addCart,
    getDetailCartByUserIDAndProductID, editCart, deleteCartByUserIDAndProductID }
    = cartController(sql);
  cartRouter.route('/detail')
    .get(getDetailAllCarts);
  cartRouter.route('/detail/:id')
    .get(getDetailCartByUserID);
  cartRouter.route('/view')
    .get(getViewAllCarts);
  cartRouter.route('/view/:id')
    .get(getViewCartByUserID);
  cartRouter.route('/add')
    .post(addCart);
  cartRouter.route('/get')
    .post(getDetailCartByUserIDAndProductID);
  cartRouter.route('/edit')
    .post(editCart);
  cartRouter.route('/delete')
    .post(deleteCartByUserIDAndProductID);
  return cartRouter;
}
module.exports = router;
