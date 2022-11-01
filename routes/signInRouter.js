// роут для авторизации пользователя после /signin
const signInRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // установка первичной валидации через joi-celebrate
const { login } = require('../controllers/usersControllers');

signInRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = signInRouter;
