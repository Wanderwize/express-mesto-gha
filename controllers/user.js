const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/notFoundError");
const DefaultError = require("../errors/defaultError");
const ValidationError = require("../errors/validationError");
const AuthorizationError = require("../errors/authoriztionError");

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new NotFoundError("Пользователь не найден"))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ValidationError("Ошибка валидации");
      }
      throw new DefaultError("На сервере произошла ошибка");
    });
};

module.exports.errorPage = (req, res) => {
  throw new NotFoundError("Страница не существует");
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true }
  )
    .orFail(new NotFoundError("Пользователь не найден"))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true }
  )
    .orFail(new NotFoundError("Пользователь не найден"))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DefaultError("На сервере произошла ошибка1"));
      }

      next(new DefaultError("На сервере произошла ошибка2"));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .orFail(new AuthorizationError("Ошибка авторизации"))
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, "super-strong-secret", {
          expiresIn: "7d",
        }),
      });
    })
    .catch(next);
};
