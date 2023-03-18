const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require('mongoose');

const path = require('path');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./routes/user');
const { login, createUser } = require('./controllers/user');
const cardRouter = require('./routes/card');
// const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

app.use(express.json());

// app.use(router);
app.use(userRouter);
app.use(cardRouter);

app.post('/signin', login);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
    }),
  }),
  createUser,
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(errors());

app.use((err, req, res, next) => {
  res.status(500).send({ message: 'Произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});
