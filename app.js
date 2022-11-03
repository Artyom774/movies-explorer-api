// основной файл сервера
require('dotenv').config();
const express = require('express'); // фреймворк express для NodeJS
const bodyParser = require('body-parser'); // анализирует тела входящих запросов в промежуточном программном обеспечении
const mongoose = require('mongoose'); // база данных NongoDB
const usersRouter = require('./routes/usersRouter');
const moviesRouter = require('./routes/moviesRouter');
const signInRouter = require('./routes/signInRouter');
const signUpRouter = require('./routes/signUpRouter');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3050 } = process.env; // файл .env хранится на сервере
const app = express(); // app работает через фреймворк Express

const allowedCors = [
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // сохраняем источник запроса в переменную origin
  if (allowedCors.includes(origin)) { // проверяем, что источник запроса есть среди разрешённых
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') { // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { // подключение к базе MongooseDB
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/signin', signInRouter); // авторизация пользователя
app.use('/signup', signUpRouter); // регистрация пользователя
app.use(auth); // проверка токена
app.use('/users', usersRouter); // пути для работы с карточками
app.use('/movies', moviesRouter); // пути для работы с пользователем
app.use('/', (req, res, next) => { next(new NotFoundError('страница не найдена')); }); // введён неизвестный путь
app.use(errorLogger); // логи
app.use(errorHandler); // обработка ошибок сервера

app.listen(PORT, () => { // при запуске сервера выводит его порт
  console.log(`Порт сервера: ${PORT}`);
});
