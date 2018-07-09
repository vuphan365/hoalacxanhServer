const debug = require('debug')('app:statusOrderController');

function statusOrderController(sql) {
  function getDetailAllStatusOrder(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT * FROM dbo.StatusOrder').then((result) => {
        debug(result);
        const statusOrders = result.recordset;
        res.json(statusOrders);
        resolve(statusOrders);
      }).catch(error => reject(error));
    });
  }
  return {
    getDetailAllStatusOrder
  };
}
module.exports = statusOrderController;
