const mongoose = require('mongoose');
// const Project = require('./projectModel');

const requestSchema = new mongoose.Schema(
	{
		voteLink: {
			type: String,
			required: [true, 'Please provide a voting link'],
		},
		project: {
			type: mongoose.Schema.ObjectId,
			ref: 'Project',
			required: [true, 'Request must belong to a user'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Vote Request must belong to a user'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

requestSchema.index({ project: 1, user: 1 }, { unique: true });

requestSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'username',
	});

	next();
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
