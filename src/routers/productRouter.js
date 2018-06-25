const express = require('express');
const adminController = require('../controllers/adminController');

const productRouter = express.Router();
const productController = require('../controllers/productController');
const jsontoken = require('../config/jsontoken');

function router(sql) {
  const { getDetailAllProducts, getDetailProductById, getViewProductById, addProduct, editProduct,
    getViewAllProducts, getContentProductById, deleteProductById } = productController(sql);
  const { isAdminExist } = adminController(sql);
  const { validateToken } = jsontoken();

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
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .post(addProduct);
  productRouter.route('/edit/:id')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .post(editProduct);
  productRouter.route('/delete/:id')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(deleteProductById);
  return productRouter;
}

module.exports = router;
