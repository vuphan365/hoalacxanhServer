const express = require('express');

const adminRouter = express.Router();
const adminController = require('../controllers/adminController');

function router(sql) {
  const { signIn, addAdmin, changePassword, updateImage } = adminController(sql);

  adminRouter.route('/signin')
    .post(signIn);
  adminRouter.route('/add')
    .post(addAdmin);
  adminRouter.route('/changepassword')
    .post(changePassword);
  adminRouter.route('/updateimage')
    .post(updateImage);
  return adminRouter;
}

module.exports = router;
