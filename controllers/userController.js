const dotenv = require('dotenv');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

dotenv.config({ path: './config.env' });

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
