const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const globalErrorHandler = require('./controllers/errorController');
// const userController = require('./controllers/userController');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.options('*', cors());

//Set Security Http Headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many request from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization againt NoSQl query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.use(compression());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;
