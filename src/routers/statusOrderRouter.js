const express = require('express');

const statusOrderRouter = express.Router();
const statusOrderController = require('../controllers/statusOrderController');

function router(sql) {
  const { getDetailAllStatusOrder } = statusOrderController(sql);

  statusOrderRouter.route('/detail')
    .get(getDetailAllStatusOrder);
  return statusOrderRouter;
}

module.exports = router;
