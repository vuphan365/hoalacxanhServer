const express = require('express');

const productTypeRouter = express.Router();
const productTypeController = require('../controllers/productTypeController');

function router(sql) {
  const { getDetailAllProductType } = productTypeController(sql);

  productTypeRouter.route('/detail')
    .get(getDetailAllProductType);
  return productTypeRouter;
}

module.exports = router;
