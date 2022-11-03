// роуты для работы с фильмами пользователя после /movies
const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // установка первичной валидации через joi-celebrate
const { // контроллеры для фильмов
  findAllMoviesOfUserById, createMovie, deleteMovie,
} = require('../controllers/moviesControllers');
const { URLregex, idRegex } = require('../utils/constants');

// для ../movies
moviesRouter.get('/', findAllMoviesOfUserById); // возвращает все сохранённые текущим  пользователем фильмы
moviesRouter.post('/', celebrate({ // создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(URLregex),
    trailerLink: Joi.string().required().pattern(URLregex),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(URLregex),
    movieId: Joi.string().required(),
  }),
}), createMovie);
moviesRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).pattern(idRegex),
  }),
}), deleteMovie);

module.exports = moviesRouter;
