const Project = require('../models/projectModel');
const User = require('../models/userModel');
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
	// const user = await User.findOne(res.locals.user._id).select('createdAt');

	req.body.dateCreated = Date.now();

	const doc = await Project.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
