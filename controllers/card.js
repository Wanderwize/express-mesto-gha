const Card = require("../models/card");
const NotFoundError = require("../errors/notFoundError");
const DefaultError = require("../errors/defaultError");
const ValidationError = require("../errors/validationError");
const AuthorizationError = require("../errors/authoriztionError");
const NotEnoughRightsError = require("../errors/NotEnoughRightsError");

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(new NotFoundError("Карточка не найдена"))
    .then((card) => {
      const user = req.user._id;
      const owner = card.owner._id.toString();

      if (user === owner) {
        Card.deleteOne(cardId);
        res.send({ message: "Карточка удалена" });
      } else {
        next(new NotEnoughRightsError("Недостаточно прав"));
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

// module.exports.likeCard = (req, res) => {
//   const { cardId } = req.params;
//   if (cardId.length === 24) {
//     Card.findByIdAndUpdate(
//       cardId,
//       { $addToSet: { likes: cardId } },
//       { new: true }
//     )
//       .then((card) => {
//         return res.send({ data: cardId });
//       })
//       .catch((err) => {
//         if (err.name === "CastError") {
//           throw new NotFoundError("Нет такой карточки");
//         } else {
//           throw new ValidationError("Ошибка валидации");
//         }
//       });
//   }
//   return console.log("test");
// };

// module.exports.dislikeCard = (req, res) => {
//   const { cardId } = req.params;
//   if (cardId.length === 24) {
//     Card.findByIdAndUpdate(cardId, { $pull: { likes: cardId } }, { new: true })
//       .then((card) => {
//         return res.send({ data: cardId });
//       })
//       .catch((err) => {
//         if (!card) {
//           return res.status(404).send({ message: "Карточка не найдена" });
//         }
//         if (err.name === "CastError") {
//           throw new NotFoundError("Нет такой карточки");
//         }
//         throw new DefaultError("На сервере произошла ошибка");
//       });
//   } else {
//     throw new ValidationError("Ошибка валидации");
//   }
//   return console.log("test");
// };

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  if (cardId.length === 24) {
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: cardId } },
      { new: true }
    )
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
    Card.findByIdAndUpdate(cardId, { $pull: { likes: cardId } }, { new: true })
      .orFail(new NotFoundError("Карточка не найдена"))
      .then((card) => {
        return res.send({ data: cardId });
      })
      .catch(next);
  }
};
