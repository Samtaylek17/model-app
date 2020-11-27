const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! Shutting down...');
	console.log(err, err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: './config.env' });

if (process.env.NODE_ENV === 'production') {
	const DB = process.env.MONGODB.replace('PASSWORD', process.env.MONGODB_PASS);
	mongoose
		.connect(DB, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		})
		.then(() => console.log('DB connection successful'));
} else {
	mongoose
		.connect(process.env.DATABASE_LOCAL, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		})
		.then(() => console.log('DB connection successful'));
}

const port = process.env.PORT || 80;

app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	console.log('UNHANDLED REJECTION! Shutting down...');
	app.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
	app.close(() => {
		console.log('🔥 Process terminated!');
	});
});
