const express = require('express');

const userRouter = express.Router();
const userController = require('../controllers/userController');

function router(sql) {
  const { getDetailAllUsers, getViewAllUsers, getDetailUserById, getViewUserById,
    addUser, editUser, getDetailUserByEmail } = userController(sql);

  userRouter.route('/detail')
    .get(getDetailAllUsers);
  userRouter.route('/detail/:id')
    .get(getDetailUserById);
  userRouter.route('/view')
    .get(getViewAllUsers);
  userRouter.route('/view/:id')
    .get(getViewUserById);
  userRouter.route('/email')
    .post(getDetailUserByEmail);
  userRouter.route('/add')
    .post(addUser);
  userRouter.route('/edit')
    .post(editUser);
  return userRouter;
}

module.exports = router;
