// роуты для работы с пользователем после /users
const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // установка первичной валидации через joi-celebrate
const { // контроллеры для пользователя
  getMeById, updateMeById,
} = require('../controllers/usersControllers');

// для ../users
usersRouter.get('/me', getMeById); // возвращает информацию о пользователе (email и имя)
usersRouter.patch('/me', celebrate({ // обновляет информацию о пользователе (email и имя)
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(64),
  }),
}), updateMeById);

module.exports = usersRouter;
