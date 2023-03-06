const User = require("../models/user");

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  if (userId.length === 24) {
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "Пользователь не найден" });
        } else return res.send({ data: user });
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
