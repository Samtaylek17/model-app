const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'A project must have a name'],
		},
		description: {
			type: String,
			required: [true, 'A project must have a description'],
		},
		dateCreated: Date.now(),
		status: {
			type: String,
			enum: ['open', 'pending', 'closed'],
			default: 'pending',
			lowercase: true,
		},
		voteLink: {
			type: String,
		},
		requests: {
			type: Number,
			required: [true, 'A project must have number of votes'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'A project must belong to a user'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

projectSchema.index({ user: 1 }, { unique: true });

projectSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'email',
	});

	next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
