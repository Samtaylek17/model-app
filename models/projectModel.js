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
		dateCreated: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		status: {
			type: String,
			enum: ['open', 'pending', 'closed'],
			default: 'pending',
			lowercase: true,
		},
		voteLink: {
			type: String,
		},
		voteRequests: {
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

// projectSchema.index({ user: 1 }, { unique: false });

projectSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'email',
	});

	next();
});

projectSchema.post(/^find/, function (docs, next) {
	console.log(`Query took ${Date.now() - this.start} milliseconds!`);
	next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
