// схема сущности movie в базе данных MongoDB
const mongoose = require('mongoose');
// const { URLregex } = require('../utils/constants');
const URLregex = /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*,]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/; // перенести в constants

const movieSchema = new mongoose.Schema({ // создание схемы для пользователей в mongoose
  county: { // страна
    type: String,
    required: true,
    maxlength: 256,
    minlength: 2,
  },
  director: { // режиссёр
    type: String,
    required: true,
    maxlength: 128,
    minlength: 2,
  },
  duration: { // длительность
    type: Number,
    required: true,
  },
  year: { // год
    type: String,
    required: true,
    maxlength: 32,
    minlength: 2,
  },
  description: { // описание
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 2,
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
    maxlength: 64,
    minlength: 2,
  },
  nameRU: { // название на русском
    type: Number,
    required: true,
    maxlength: 256,
    minlength: 1,
  },
  nameEN: { // название на английском
    type: Number,
    required: true,
    maxlength: 256,
    minlength: 1,
  },
});
movieSchema.set('versionKey', false); // убирает __v при создании пользователя

module.exports = mongoose.model('movie', movieSchema);
