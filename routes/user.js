const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
  errorPage,
} = require('../controllers/user');
// const { createUser } = require('../controllers/user');

userRouter.get('/users', auth, getUsers);
userRouter.patch('/users/me', auth, updateProfile);
userRouter.patch('/users/me/avatar', auth, updateAvatar);

userRouter.get('/users/:userId', auth, getUser);
userRouter.patch('/404', auth, errorPage);
userRouter.get('/users/me', auth);

module.exports = userRouter;
