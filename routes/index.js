// роут для работы с сервером
const mainRouter = require('express').Router();
const bodyParser = require('body-parser'); // анализирует тела входящих запросов в промежуточном программном обеспечении
const { errors } = require('celebrate');
const usersRouter = require('./usersRouter');
const moviesRouter = require('./moviesRouter');
const signInRouter = require('./signInRouter');
const signUpRouter = require('./signUpRouter');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');
const NotFoundError = require('../errors/NotFoundError');
const { requestLogger, errorLogger } = require('../middlewares/logger');

mainRouter.use(bodyParser.json());
mainRouter.use(bodyParser.urlencoded({ extended: true }));
mainRouter.use(requestLogger);

mainRouter.use('/signin', signInRouter); // авторизация пользователя
mainRouter.use('/signup', signUpRouter); // регистрация пользователя
mainRouter.use(auth); // проверка токена
mainRouter.use('/users', usersRouter); // пути для работы с карточками
mainRouter.use('/movies', moviesRouter); // пути для работы с пользователем
mainRouter.use('/', (req, res, next) => { next(new NotFoundError('страница не найдена')); }); // введён неизвестный путь
mainRouter.use(errors()); // обработка ошибок библиотеки celebrate
mainRouter.use(errorLogger); // логи
mainRouter.use(errorHandler); // обработка ошибок сервера

module.exports = mainRouter;
