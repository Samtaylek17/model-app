const { Model } = require('mongoose');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setProjectUserIds = (req, res, next) => {
	if (!req.body.user) req.body.user = req.user.setProjectUserIds;
	next();
};

exports.aliasTopProject = (req, res, next) => {
	req.query.limit = '3';
	req.query.sort = '-dateCreated';
	next();
};

exports.getAllProjects = factory.getAll(Project);

exports.getProject = factory.getOne(Project);

exports.createProject = catchAsync(async (req, res, next) => {
	const user = await User.findOne(res.locals.user._id);
	try {
		if (user) {
			req.body.dateCreated = Date.now();
			req.body.user = user;

			const doc = await Project.create(req.body);

			res.status(201).json({
				status: 'success',
				data: {
					data: doc,
				},
			});
		} else {
			res.status(401).json({
				status: 'error',
				message: 'You need to be logged in to create a project',
			});
		}
	} catch (error) {
		console.log(error);
	}
});

exports.updateProject = catchAsync(async (req, res, next) => {
	try {
		const user = await User.findOne(res.locals.user._id);
		const doc = await Project.findByIdAndUpdate(req.params.id);

		if (user.id !== doc.user.id) {
			return next(
				new AppError('You are not authorized to update this project', 401)
			);
		} else {
			req.body.user = user;
			req.body.status = 'pending';
			doc = await Project.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});

			if (!doc) {
				return next(new AppError('No document found with that ID', 404));
			}

			res.status(200).json({
				status: 'success',
				data: {
					data: doc,
				},
			});
		}
	} catch (error) {
		console.log(error);
	}

	next();
});

exports.deleteProject = catchAsync(async (req, res, next) => {
	const user = await User.findOne(res.locals.user._id);
	const doc = await Project.findById(req.params.id);

	if (user.id !== doc.user.id) {
		res.status(401).json({
			status: 'error',
			message: 'You are not authorized to delete this project',
		});
	} else {
		doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			data: null,
		});
	}
});
