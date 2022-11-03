// схема сущности movie в базе данных MongoDB
const mongoose = require('mongoose');
const { URLregex } = require('../utils/constants');

const movieSchema = new mongoose.Schema({ // создание схемы для пользователей в mongoose
  country: { // страна
    type: String,
    required: true,
  },
  director: { // режиссёр
    type: String,
    required: true,
  },
  duration: { // длительность
    type: Number,
    required: true,
  },
  year: { // год
    type: String,
    required: true,
  },
  description: { // описание
    type: String,
    required: true,
  },
  image: { // ссылка на постер
    type: String,
    required: true,
    validate: [URLregex, 'invalidLink'],
  },
  trailerLink: { // ссылка на трейлер
    type: String,
    required: true,
    validate: [URLregex, 'invalidLink'],
  },
  thumbnail: { // сылка на миниатюрный постер
    type: String,
    required: true,
    validate: [URLregex, 'invalidLink'],
  },
  owner: { // кто сохранил фильм
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: { // id фильма, который содержится в сервисе MoviesExplorer
    type: String,
    required: true,
  },
  nameRU: { // название на русском
    type: String,
    required: true,
  },
  nameEN: { // название на английском
    type: String,
    required: true,
  },
});
movieSchema.set('versionKey', false); // убирает __v при создании пользователя

module.exports = mongoose.model('movie', movieSchema);
