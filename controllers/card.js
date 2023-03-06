const Card = require("../models/card");

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  if (cardId.length === 24) {
    Card.findByIdAndRemove(cardId, {
      new: true,
      runValidators: true,
      upsert: true,
    })
      .then((card) => res.send(card))
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(404).send({ message: "Нет такой карточки" });
        }
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      });
  } else return res.status(400).send({ message: "ворк" });
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
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
      { runValidators: true }
    )
      .then((card) => res.send(card))
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(404).send({ message: "Нет такой карточки" });
        }

        return res.status(500).send({ message: "На сервере произошла ошибка" });
      });
  } else return res.status(400).send({ message: "Некорректный формат данных" });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  if (cardId.length === 24) {
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
      { new: true, runValidators: true, upsert: true }
    )
      .then((card) => res.send(card))
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(404).send({ message: "Нет такой карточки" });
        }
        return res.status(500).send({ message: "На сервере произошла ошибка" });
      });
  } else return res.status(400).send({ message: "Некорректный формат данных" });
};
