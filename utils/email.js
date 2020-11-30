const nodemailer = require('nodemailer');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.username = user.username;
		this.url = url;
		this.from = `Dev from Juba <${process.env.EMAIL_FROM}`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			//Sendgrid
			return nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENGRID_PASSWORD,
				},
			});
		}

		// To use sendgrid in development
		return nodemailer.createTransport({
			service: 'SendGrid',
			auth: {
				user: process.env.SENDGRID_USERNAME,
				pass: process.env.SENGRID_PASSWORD,
			},
		});
	}

	async send(template, subject, info = '') {
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			text: this.url,
		};
	}

	async sendWelcome() {
		await this.send('welcome', 'You just signed up to Juba');
	}

	async sendLogin(info) {
		await this.send('login', 'New Login Alert', info);
	}

	async sendDeactivate() {
		await this.send('deactivate', 'Are you done with your project');
	}

	async sendPasswordReset() {
		await this.send(
			'passwordReset',
			'Reset your Password (Url valid for 10 mins)'
		);
	}

	async sendVerifyEmail() {
		await this.send('verifyEmail', 'Verify Your Email (Url valid for 10 mins)');
	}
};
