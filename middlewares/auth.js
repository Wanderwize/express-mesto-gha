// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const User = require('../models/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация1' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация2' });
  }

  req.user = payload;
  next();
  return console.log('123');
};
