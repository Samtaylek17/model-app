const User = require('../models/userModel');
const Project = require('../models/projectModel');
const Request = require('../models/requestModel');

const factory = require('./handlerFactory');

exports.setRequestUserIds = (req, res, next) => {
	if (!req.body.user) req.body.user = req.user.id;
	next();
};

exports.getAllRequests = factory.getAll(Request);
exports.getRequest = factory.getOne(Request);
exports.createRequest = factory.createOne(Request);
exports.updateRequest = factory.updateOne(Request);
exports.deleteRequest = factory.deleteOne(Request);
