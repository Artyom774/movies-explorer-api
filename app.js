// основной файл сервера
require('dotenv').config();
const express = require('express'); // фреймворк express для NodeJS
const mongoose = require('mongoose'); // база данных NongoDB
const mainRouter = require('./routes/index'); // файл со всеми роутами
const mongoAddress = require('./utils/constants');

const { NODE_ENV, DB_ADDRESS } = process.env; // файл с важными данными, хранящийся на ВМ

const { PORT = 3050 } = process.env; // файл .env хранится на сервере
const app = express(); // app работает через фреймворк Express

const allowedCors = [ // разрешённые домены для запросов на этот сервер
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

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : mongoAddress, { // подключение к базе MongooseDB
  useNewUrlParser: true,
});
app.use(mainRouter);
app.listen(PORT, () => { // при запуске сервера выводит его порт
  console.log(`Порт сервера: ${PORT}`);
});
