const Card = require("../models/card");

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({ message: "Нет такой карточки" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
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
  const cardId = "6404a21be93bfc2a675b16f3";
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка валидации" });
      } else if (err.name === "CastError") {
        return res.status(404).send({ message: "Нет такой карточки" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка валидации" });
      } else if (err.name === "CastError") {
        return res.status(404).send({ message: "Нет такой карточки" });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};
