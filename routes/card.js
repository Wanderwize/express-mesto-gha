const cardRouter = require("express").Router();
const auth = require("../middlewares/auth");
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require("../controllers/card");

cardRouter.get("/cards", auth, getCards);

cardRouter.post(
  "/cards",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(
        /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/
      ),
    }),
  }),
  createCard
);

cardRouter.delete(
  "/cards/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  auth,
  deleteCard
);

cardRouter.put(
  "/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  auth,
  likeCard
);

cardRouter.delete(
  "/cards/:cardId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  dislikeCard
);

// userRouter.get("/:userId", getUser);

// router.get('/users/:userId', (req, res) => {
//   res.send(users[req.params.id])
// })

module.exports = cardRouter;
