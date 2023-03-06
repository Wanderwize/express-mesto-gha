const cardRouter = require("express").Router();

const Card = require("../models/card.js");

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require("../controllers/card");

cardRouter.get("/cards", getCards);

cardRouter.post("/cards", createCard);

cardRouter.delete("/cards/:cardId", deleteCard);

cardRouter.put("/cards/:cardId/likes", likeCard);

cardRouter.delete("/cards/:cardId/likes", dislikeCard);

// userRouter.get("/:userId", getUser);

// router.get('/users/:userId', (req, res) => {
//   res.send(users[req.params.id])
// })

module.exports = cardRouter;
