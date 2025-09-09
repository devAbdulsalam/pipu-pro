// utils/notificationService.js
import twilio from 'twilio';
import emailTransporter from './transporter.js';

const twilioClient = twilio(
	process.env.TWILIO_SID,
	process.env.TWILIO_AUTH_TOKEN
);

export const generatePaymentLink = (collectionCode, uniqueCode, amount) => {
	return `${process.env.BASE_URL}/payments/${collectionCode}/${uniqueCode}`;
};

export const sendNotification = async (
	phone,
	email,
	paymentLink,
	collection
) => {
	// Send SMS
	if (phone) {
		await twilioClient.messages.create({
			body: `Payment Request: ${collection.title}\nAmount: ₦${
				collection.amount
			}\nDue: ${collection.dueDate.toDateString()}\nPay: ${paymentLink}`,
			from: process.env.TWILIO_PHONE,
			to: phone,
		});
	}

	// Send Email
	if (email) {
		await emailTransporter.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: `Payment Request: ${collection.title}`,
			html: `
        <h2>Payment Request</h2>
        <p><strong>Title:</strong> ${collection.title}</p>
        <p><strong>Amount:</strong> ₦${collection.amount}</p>
        <p><strong>Due Date:</strong> ${collection.dueDate.toDateString()}</p>
        <a href="${paymentLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Pay Now</a>
      `,
		});
	}
};

export const sendReceipt = async (phone, email, payment) => {
	// Implementation for sending receipts
};
// This could include sending a confirmation SMS or email with payment details
