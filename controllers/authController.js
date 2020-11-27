const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, req, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		cookieOptions.secure =
			req.secure || req.headers('x-forwarded-proto') === 'https';
	}

	res.cookie('jwt', token, cookieOptions);

	// Remove password field from output after creating user
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const { username, email, password, passwordConfirm } = req.body;

	if (!username || !email || !password || !passwordConfirm) {
		return next(new AppError('All fields are required!', 400));
	}

	req.body.createdAt = Date.now();
	req.body.lastLoggedIn = Date.now();

	//Create new user
	const newUser = await User.create(req.body);

	createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// 1) Check if email and password exists
	if (!email || !password) {
		return next(new AppError('Please provide email and password!', 400));
	}
	// 2) Check if user exists && password is correct
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	// Update last login field
	await User.findByIdAndUpdate(user._id, {
		lastLoggedIn: Date.now(),
	});

	// 3) If everything is okay, send token to client
	createSendToken(user, 200, req, res);
});
