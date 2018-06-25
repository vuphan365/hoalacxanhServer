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
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(getDetailAllUsers);
  userRouter.route('/detail/me')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .get(getDetailUser);
  userRouter.route('/detail/get/:id')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(getDetailUserById);
  userRouter.route('/view')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(getViewAllUsers);
  userRouter.route('/view/me')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .get(getViewUser);
  userRouter.route('/email')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .post(getDetailUserByEmail);
  userRouter.route('/view/get/:id')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(getViewUserById);
  userRouter.route('/add')
    .post(addUser);
  userRouter.route('/edit')
    .all((req, res, next) => {
      validateToken(req, res, next, isUserExist);
    })
    .post(editUser);
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
