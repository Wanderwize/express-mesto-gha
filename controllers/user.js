const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/notFoundError");
const DefaultError = require("../errors/defaultError");
const ValidationError = require("../errors/validationError");
const AuthorizationError = require("../errors/authoriztionError");

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  if (userId.length === 24) {
    User.findById(userId)
      .then((user) => {
        if (!user) {
          throw new NotFoundError("Нет такого пользователя");
        }
        return res.send({ data: user });
      })
      .catch((err) => {
        if (err.name === "CastError") {
          throw new NotFoundError("Нет такого пользователя");
        }
        if (err.name === "ValidationError") {
          throw new ValidationError("Ошибка валидации");
        }

        throw new DefaultError("На сервере произошла ошибка");
      });
  } else throw new ValidationError("Ошибка валидации");

  return console.log("test");
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ValidationError("Ошибка валидации");
      }

      throw new DefaultError("На сервере произошла ошибка");
    });
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

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ValidationError("Ошибка валидации");
      }
      if (err.name === "CastError") {
        throw new NotFoundError("Нет такого пользователя");
      }
      throw new DefaultError("На сервере произошла ошибка");
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ValidationError("Ошибка валидации");
      }
      if (err.name === "CastError") {
        throw new NotFoundError("Нет такого пользователя");
      }
      throw new DefaultError("На сервере произошла ошибка");
    });
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
      if (err.name === "ValidationError") {
        throw new ValidationError("Ошибка валидации");
      }

      if (err.code === 11000) {
        throw new DefaultError("На сервере произошла ошибка");
      }

      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, "super-strong-secret", {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
