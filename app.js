const express = require("express");
const { PORT = 3000 } = process.env;
const app = express();
const mongoose = require("mongoose");

const userRouter = require("./routes/user");
const cardRouter = require("./routes/card");
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://0.0.0.0:27017/mestodb", {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "6403e49f6e0097ae76646578", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// app.use(router);
app.use(userRouter);
app.use(cardRouter);

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});
