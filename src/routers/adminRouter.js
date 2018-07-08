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
    .get((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        getDetailAdmin(req, res);
      }).catch(() => res.sendStatus(403));
    });
  adminRouter.route('/add')
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        addAdmin(req, res);
      }).catch(() => res.sendStatus(403));
    });
  adminRouter.route('/changepassword')
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        changePassword(req, res);
      }).catch(() => res.sendStatus(403));
    });
  adminRouter.route('/updateimage')
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        updateImage(req, res);
      }).catch(() => res.sendStatus(403));
    });
  adminRouter.route('/signin')
    .post((req, res) => {
      debug(req.headers);
      const { username, password } = req.body;
      const admin = { username, password };
      debug(admin);
      isAdminExist(admin).then((result) => {
        debug('result', result);
        const user = { username };
        if (result.isExist) {
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
