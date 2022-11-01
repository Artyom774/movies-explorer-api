// контроллеры для работы с сущностями users
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMeById = (req, res, next) => { // возвращает информацию о пользователе
  User.findById(req.user)
    .orFail(new NotFoundError(`Пользователь c id '${req.params.id}' не найден`))
    .then((user) => {
      if (user) {
        res.status(200).send({
          email: user.email,
          name: user.name,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`'${req.params.id}' не является корректным идентификатором`));
      } else {
        next(err);
      }
    });
};

module.exports.updateMeById = (req, res, next) => { // обновляет информацию о пользователе
  const meId = req.user._id;
  const { email, name } = req.body;

  User.findByIdAndUpdate(meId, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь c id '${req.params.id}' не найден`))
    .then((user) => {
      if (user) {
        res.status(200).send({
          _id: user._id,
          email: user.email,
          name: user.name,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Новые данные не удовлетворяют требованиям валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash, // записываем хеш в базу
      name: req.body.name,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные о новом пользователе не удовлетворяют требованиям валидации'));
      } else
      if (err.code === 11000) {
        next(new DuplicateError('Пользователь с таким email уже есть в базе данных'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '30d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};
