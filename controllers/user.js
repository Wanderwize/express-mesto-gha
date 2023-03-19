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
          return res.status(404).send({ message: "Пользователь не найден" });
        }
        return res.send({ data: user });
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return res
            .status(404)
            .send({ message: "Нет пользователя с таким id" });
        }
        if (err.name === "ValidationError") {
          return res.status(400).send({ message: "Ошибка валидации" });
        }

        return res.status(500).send({ message: "На сервере произошла ошибка" });
      });
  } else return res.status(400).send({ message: "Некорректный формат данных" });

  return console.log("test");
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.status === "CastError") {
        return res.status(400).send({ message: "Пользователи отсутствуют" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка валидации" });
      }

      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка валидации" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.errorPage = (req, res) =>
  res.status(404).send({ message: "Такой страницы не существует" });

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
        return res.status(400).send({ message: "Ошибка валидации" });
      }
      if (err.name === "CastError") {
        return res.status(404).send({ message: "Нет пользователя с таким id" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
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
        return res.status(400).send({ message: "Ошибка валидации" });
      }
      if (err.name === "CastError") {
        return res.status(404).send({ message: "Нет пользователя с таким id" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
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
      if (!user) {
        throw new ValidationError("Ошибка валидации");
      }
      res.send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Ошибка валидации данных пользователя" });
      }

      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "Данный email уже зарегестрирован" });
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
