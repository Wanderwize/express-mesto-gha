const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const DefaultError = require('../errors/defaultError');
const ValidationError = require('../errors/validationError');
const AuthorizationError = require('../errors/authoriztionError');

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  if (userId.length === 24) {
    User.findById(userId)
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Нет пользователя с таким id');
        }
        return res.send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          throw new NotFoundError('Нет пользователя с таким id');
        }
        if (err.name === 'ValidationError') {
          throw new ValidationError('Ошибка валидации');
        }

        throw new DefaultError('На сервере произошла ошибка');
      });
  } else throw new ValidationError('Некорректный формат данных');

  return console.log('test');
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.status === 'CastError') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации');
      }

      throw new DefaultError('На сервере произошла ошибка');
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации');
      }
      throw new DefaultError('На сервере произошла ошибка');
    });
};

module.exports.errorPage = (req, res) => {
  console.log(req, res);
  throw new NotFoundError('Такой страницы не существует');
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      throw new DefaultError('На сервере произошла ошибка');
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации');
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      throw new DefaultError('На сервере произошла ошибка');
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      console.log(err);
      throw new AuthorizationError('Ошибка авторизации');
    });
};
