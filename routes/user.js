const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
userRouter.patch(
  '/users/me',
  auth,
  celebrate({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
  updateProfile,
);
userRouter.patch(
  '/users/me/avatar',
  auth,
  celebrate({
    avatar: Joi.string().required().url(),

  }),
  updateAvatar,
);

userRouter.get('/users/:userId', auth, getUser);
userRouter.patch('/404', auth, errorPage);
userRouter.get('/users/me', auth);

module.exports = userRouter;
