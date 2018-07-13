const express = require('express');
const debug = require('debug')('app:userRoute');
const adminController = require('../controllers/adminController');

const userRouter = express.Router();
const userController = require('../controllers/userController');
const jsontoken = require('../config/jsontoken');

function router(sql) {
  const { getDetailAllUsers, getViewAllUsers, getDetailUserById, getViewUserById,
    addUser, editUser, getDetailUserByEmail, isUserExist, getViewUser, getDetailUser }
    = userController(sql);
  const { isAdminExist } = adminController(sql);
  const { signIn, validateToken } = jsontoken();

  userRouter.route('/detail')
    .get((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        getDetailAllUsers(req, res);
      }).catch(() => res.sendStatus(403));
    });
  userRouter.route('/detail/me')
    .get((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        getDetailUser(req, res);
      }).catch(() => res.sendStatus(403));
    });
  userRouter.route('/detail/get/:id')
    .get((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        getDetailUserById(req, res);
      }).catch(() => res.sendStatus(403));
    });
  userRouter.route('/view')
    .get((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        getViewAllUsers(req, res);
      }).catch(() => res.sendStatus(403));
    });
  userRouter.route('/view/me')
    .get((req, res) => {
      debug(req.headers);
      validateToken(req, res, isUserExist).then(() => {
        debug('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        getViewUser(req, res);
      }).catch(() => res.sendStatus(403));
    });
  userRouter.route('/email')
    .post((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        getDetailUserByEmail(req, res);
      }).catch(() => res.sendStatus(403));
    });
  userRouter.route('/view/get/:id')
    .get((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        getViewUserById(req, res);
      }).catch(() => res.sendStatus(403));
    });
  userRouter.route('/add')
    .post(addUser);
  userRouter.route('/edit')
    .post((req, res) => {
      validateToken(req, res, isUserExist).then(() => {
        editUser(req, res);
      }).catch(() => res.sendStatus(403));
    });
  userRouter.route('/signin')
    .post((req, res) => {
      const { name, email } = req.body;
      const user = { name, email };
      isUserExist(user).then((result) => {
        if (result) {
          debug('Exist');
          signIn(res, req, user);
        } else {
          debug('Unexist');
          addUser(req, res);
          signIn(res, req, user);
        }
      });
    });
  return userRouter;
}

module.exports = router;
