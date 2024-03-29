const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('./errors/notFoundError');
const regEx = require('./utils/regex');
const userRouter = require('./routes/user');
const { login, createUser } = require('./controllers/user');
const cardRouter = require('./routes/card');
const errorHandler = require('./errors/errorHandler');

const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

app.use(express.json());
app.use(userRouter);
app.use(cardRouter);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regEx.link),
    }),
  }),
  createUser,
);
app.use('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});
