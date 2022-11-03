// схема сущности user в базе данных MongoDB
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { isEmail } = require('validator'); // достать валидацию для почты
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({ // создание схемы для пользователей в mongoose
  email: { // почта
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'invalidEmail'],
  },
  password: { // пароль
    type: String,
    required: true,
    select: false,
  },
  name: { // имя
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
    default: 'Новый пользователь',
  },
});
userSchema.set('versionKey', false); // убирает __v при создании пользователя

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        const newUnauthorizedError = new UnauthorizedError('Неправильные почта или пароль');
        newUnauthorizedError.name = 'emailPasswordError';
        return Promise.reject(newUnauthorizedError);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const newUnauthorizedError = UnauthorizedError('Неправильные почта или пароль');
            newUnauthorizedError.name = 'emailPasswordError';
            return Promise.reject(newUnauthorizedError);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
