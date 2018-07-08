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
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        addProduct(req, res);
      }).catch(() => res.sendStatus(403));
    });
  productRouter.route('/edit/:id')
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        editProduct(req, res);
      }).catch(() => res.sendStatus(403));
    });
  productRouter.route('/delete/:id')
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        deleteProductById(req, res);
      }).catch(() => res.sendStatus(403));
    });
  return productRouter;
}

module.exports = router;
