const cardRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require("../controllers/card");

cardRouter.get("/cards", getCards);

cardRouter.post("/cards", createCard);

cardRouter.delete(
  "/cards/:cardId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCard
);

cardRouter.put(
  "/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  likeCard
);

cardRouter.delete("/cards/:cardId/likes", dislikeCard);

// userRouter.get("/:userId", getUser);

// router.get('/users/:userId', (req, res) => {
//   res.send(users[req.params.id])
// })

module.exports = cardRouter;
