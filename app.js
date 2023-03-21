const express = require("express");

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require("mongoose");

const auth = require("./middlewares/auth");
const { errorPage } = require("./controllers/user");

const path = require("path");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const { celebrate, Joi } = require("celebrate");
const userRouter = require("./routes/user");
const { login, createUser } = require("./controllers/user");
const cardRouter = require("./routes/card");
const errorHandler = require('./errors/errorHandler')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://0.0.0.0:27017/mestodb", {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

app.use(express.json());

// app.use(router);
app.use(userRouter);
app.use(cardRouter);
app.use("/404", auth, errorPage);
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+))(:\d{2,5})?((\/.+)+)?\/?#?/
      ),
    }),
  }),
  createUser
);

app.use(express.static(path.join(__dirname, "public")));

app.use(errors());

// app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});
