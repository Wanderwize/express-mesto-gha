const userRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");
const {
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
  errorPage,
} = require("../controllers/user");
// const { createUser } = require('../controllers/user');

userRouter.get("/users", auth, getUsers);

userRouter.patch(
  "/users/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile
);
userRouter.patch(
  "/users/me/avatar",
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(
        /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/
      ),
    }),
  }),

  updateAvatar
);

userRouter.get(
  "/users/:userId",
  auth,
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUser
);
userRouter.patch("/404", auth, errorPage);
userRouter.get(
  "/users/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2),
    }),
  }),
  getUser
);

module.exports = userRouter;
