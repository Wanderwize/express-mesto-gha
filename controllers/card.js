const Card = require("../models/card");
const NotFoundError = require("../errors/notFoundError");
const DefaultError = require("../errors/defaultError");
const ValidationError = require("../errors/validationError");
const AuthorizationError = require("../errors/authoriztionError");

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
        next(new AuthorizationError("Недостаточно прав"));
      }
    })
    .catch(next);
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

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (cardId.length === 24) {
    Card.findById(cardId, { $addToSet: { likes: cardId } }, { new: true })
      .orFail(new NotFoundError("Карточка не найдена"))
      .then((card) => {
        return res.send({ data: cardId });
      })
      .catch(next);
  }
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (cardId.length === 24) {
    Card.findById(cardId, { $pull: { likes: cardId } }, { new: true })
      .orFail(new NotFoundError("Карточка не найдена"))
      .then((card) => {
        return res.send({ data: cardId });
      })
      .catch(next);
  }
};
