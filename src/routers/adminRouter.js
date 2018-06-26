const express = require('express');
const debug = require('debug')('app:adminRoute');
const jsontoken = require('../config/jsontoken');

const adminRouter = express.Router();
const adminController = require('../controllers/adminController');

function router(sql) {
  const { addAdmin, changePassword, updateImage, isAdminExist, getDetailAdmin }
  = adminController(sql);
  const { signIn, validateToken } = jsontoken();
  adminRouter.route('/me')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(getDetailAdmin);
  adminRouter.route('/add')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .post(addAdmin);
  adminRouter.route('/changepassword')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .post(changePassword);
  adminRouter.route('/updateimage')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .post(updateImage);
  adminRouter.route('/signin')
    .post((req, res) => {
      const { username, password } = req.body;
      const admin = { username, password };
      debug(admin);
      isAdminExist(admin).then((result) => {
        debug('result', result);
        if (result.isExist) {
          const { image, adminID } = result.adminResult;
          const user = { image, username, adminID };
          debug(user);
          debug('Exist');
          signIn(res, req, user);
        } else {
          debug('Unexist');
          const msg = 'Sai tên đăng nhập hoặc mật khẩu';
          const error = { msg };
          res.json(error);
        }
      });
    });
  return adminRouter;
}

module.exports = router;
