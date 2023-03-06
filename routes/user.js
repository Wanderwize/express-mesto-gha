const userRouter = require('express').Router();

const {
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
  errorPage
} = require('../controllers/user');
const { createUser } = require('../controllers/user');

userRouter.get('/users', getUsers);
userRouter.patch('/users/me', updateProfile);
userRouter.patch('/users/me/avatar', updateAvatar);

userRouter.get('/users/:userId', getUser);
userRouter.patch('/404', errorPage);
userRouter.post('/users', createUser);

module.exports = userRouter;
