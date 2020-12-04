const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app-test');
const User = require('../models/userModel');

jest.useFakeTimers();
jest.setTimeout(30000);

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
	_id: userOneId,
	username: 'Sam',
	email: 'sam@example.com',
	password: '12345678',
	passwordConfirm: '12345678',
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET, {
				expiresIn: process.env.JWT_EXPIRES_IN,
			}),
		},
	],
};

beforeEach(async () => {
	await User.deleteMany();
	await new User(userOne).save();
});

test('Should signup a new user', async () => {
	await request(app)
		.post('/api/v1/users/signup')
		.send({
			username: 'samtaylekeed',
			email: 'samtaylek@gmail.com',
			password: '12345678',
			passwordConfirm: '12345678',
		})
		.expect(201);
});

test('Should login exisiting user', async () => {
	await request(app)
		.post('/api/v1/users/login')
		.send({
			email: userOne.email,
			password: userOne.password,
		})
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.expect(200);
});

test('Should not login nonexistent user', async () => {
	await request(app)
		.post('/api/v1/users/login')
		.send({
			email: userOne.email,
			password: 'thisisawrongpass',
		})
		.expect(400);
});

// test('Should get profile for user', async () => {
// 	console.log(userOne.tokens[0].token);
// 	await request(app)
// 		.get('/api/v1/users/me')
// 		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
// 		.send()
// 		.expect(200);
// });

test('Should not get profile for unauthenticated user', async () => {
	await request(app).get('/api/v1/users/me').send().expect(401);
});
