const Card = require("../models/card");
const NotFoundError = require("../errors/notFoundError");
const AuthorizationError = require("../errors/authorizationError");

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(new NotFoundError("Карточка не найдена"))
    .then((card) => {
      const user = req.user._id;
      const owner = card.owner._id.toString();

      if (user === owner) {
        card.remove();
        res.send({ message: "Карточка удалена" });
      } else {
        next(new AuthorizationError("ошибка авторизации"));
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка валидации" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({ message: "Карточки отсутствуют" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
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
          return res.status(404).send({ message: "Карточка не найдена" });
        }
        return res.send({ data: cardId });
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(404).send({ message: "Нет такой карточки" });
        }

        return res.status(500).send({ message: "На сервере произошла ошибка" });
      });
  } else return res.status(400).send({ message: "Некорректный формат данных" });
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
          return res.status(404).send({ message: "Нет такой карточки" });
        }
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      });
  } else return res.status(400).send({ message: "Некорректный формат данных" });
  return console.log("test");
};
