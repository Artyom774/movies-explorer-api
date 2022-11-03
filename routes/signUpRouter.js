// роут для регистрации нового пользователя после /signup
const signUpRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // установка первичной валидации через joi-celebrate
const { createUser } = require('../controllers/usersControllers');

signUpRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

module.exports = signUpRouter;
