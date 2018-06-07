const express = require('express');

const productRouter = express.Router();
const productController = require('../controllers/productController');

function router(sql) {
  const { getDetailAllProducts, getDetailProductById, getViewProductById, addProduct, editProduct,
    getViewAllProducts, getContentProductById, deleteProductById } = productController(sql);
  productRouter.route('/detail')
    .get(getDetailAllProducts);
  productRouter.route('/detail/:id')
    .get(getDetailProductById);
  productRouter.route('/view')
    .get(getViewAllProducts);
  productRouter.route('/view/:id')
    .get(getViewProductById);
  productRouter.route('/view/:id/content')
    .get(getContentProductById);
  productRouter.route('/add')
    .post(addProduct);
  productRouter.route('/edit/:id')
    .post(editProduct);
  productRouter.route('/delete/:id')
    .get(deleteProductById);
  return productRouter;
}

module.exports = router;
