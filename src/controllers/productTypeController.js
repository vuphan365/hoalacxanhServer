const debug = require('debug')('app:productTypeController');

function productTypeController(sql) {
  function getDetailAllProductType(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT * FROM dbo.TypeProduct').then((result) => {
        debug(result);
        const productTypes = result.recordset;
        res.json(productTypes);
        resolve(productTypes);
      }).catch(error => reject(error));
    });
  }
  return {
    getDetailAllProductType
  };
}
module.exports = productTypeController;
