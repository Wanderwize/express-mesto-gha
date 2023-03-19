const Card = require("../models/card");
const NotFoundError = require("../errors/notFoundError");
const DefaultError = require("../errors/defaultError");
const ValidationError = require("../errors/validationError");
const AuthorizationError = require("../errors/authoriztionError");
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)

    .then((card) => {
      if (!card) {
        throw new NotFoundError("Нет такой карточки");
      }
      if (card.owner._id.toString() !== req.user._id) {
        throw new AuthorizationError("Доступ ограничен");
      }

      return Card.deleteOne(card).then(() =>
        res.send({ message: "Карточка удалена" })
      );
    })
    .catch((err) => {
      if (err.name === "NotFound") {
        throw new NotFoundError("Нет такой карточки");
      }
      throw new DefaultError("На сервере произошла ошибка");
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError("Некорректные данные при создании карточки"));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new NotFoundError("Нет такой карточки");
      }
      throw new DefaultError("На сервере произошла ошибка");
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  if (cardId.length === 24) {
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: cardId } },
      { new: true },
      { runValidators: true }
    )
      .then((card) => {
        if (!card) {
          throw new NotFoundError("Нет такой карточки");
        }
        return res.send({ data: cardId });
      })
      .catch((err) => {
        if (err.name === "CastError") {
          throw new NotFoundError("Нет такой карточки");
        }

        throw new DefaultError("На сервере произошла ошибка");
      });
  } else throw new ValidationError("Ошибка валидации");
  return console.log("test");
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (cardId.length === 24) {
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: cardId } },
      { new: true },
      { new: true, runValidators: true, upsert: true }
    )
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: "Карточка не найдена" });
        }
        return res.send({ data: cardId });
      })
      .catch((err) => {
        if (err.name === "CastError") {
          throw new NotFoundError("Нет такой карточки");
        }
        throw new DefaultError("На сервере произошла ошибка");
      });
  } else throw new ValidationError("Ошибка валидации");
  return console.log("test");
};
