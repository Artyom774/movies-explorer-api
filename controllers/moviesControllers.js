// контроллеры для работы с сущностями movies
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movieModel');

// возвращает все сохранённые текущим пользователем фильмы
module.exports.findAllMoviesOfUserById = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => { // создаёт фильм с переданными в теле данными
  const ownerId = req.user._id;

  Movie.create({
    ...req.body,
    owner: ownerId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные о новом фильме не удовлетворяют требованиям валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => { // удаляет сохранённый фильм по id из запроса
  const ownerId = req.user._id;

  Movie.findById(req.params.id)
    .orFail(new NotFoundError(`Карточка c id '${req.params.id}' не найдена`))
    .then((movie) => {
      if (movie.owner.toString() === ownerId) {
        movie.delete()
          .then(() => res.status(200).json({ message: `Фильм c id '${req.params.id}' успешно удалён` }))
          .catch((err) => next(err));
      } else { throw new ForbiddenError('Вы не сохраняли этот фильм'); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`'${req.params.id}' не является корректным идентификатором`));
      } else {
        next(err);
      }
    });
};
