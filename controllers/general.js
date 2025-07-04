import { startOfDay, addDays } from 'date-fns';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import crypto from 'crypto';
import User from '../models/User.js';
import axios from 'axios';
// import { subscribe } from './general';
export const getSubscriptionPlans = async (req, res) => {
	try {
		const plans = await SubscriptionPlan.find();
		res.status(200).json(plans);
	} catch (error) {
		console.error('Error getting plans:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getSubscription = async (req, res) => {
	try {
		const plans = await Subscription.find({ userId: req.user._id });
		res.status(200).json(plans);
	} catch (error) {
		console.error('Error getting plans:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

// Create a Paystack checkout session

// app.post('/api/paystack/create-checkout-session', async (req, res) => {

export const subscribe = async (req, res) => {
	try {
		const { planId } = req.body;
		const userId = req.user._id;

		// 1. Get plan details
		const plan = await SubscriptionPlan.findById(planId).select(
			'name price duration'
		);
		if (!plan) {
			return res.status(404).json({ error: 'Plan not found' });
		}

		const amount = plan?.price;
		const secret = process.env.PAYSTACK_SECRET_KEY;
		const response = await axios.post(
			'https://api.paystack.co/transaction/initialize',
			{
				email: req.user.email,
				amount: amount * 100, // Paystack amount is in kobo
				metadata: {
					userId: userId,
					planId: planId,
					planName: plan?.name,
					planPrice: plan?.price,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${secret}`,
				},
			}
		);

		const authorizationUrl = response.data.data.authorization_url;
		res.json({ authorizationUrl, data: response.data.data });
	} catch (error) {
		console.error('Error creating subscribing:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const verifyPaystackPayment2 = async (id) => {
	try {
		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${id}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				},
			}
		);

		return response.data.data; // Extract the transaction data
	} catch (error) {
		console.error(
			'Payment verification failed:',
			error.response?.data || error.message
		);
		throw {
			message: 'Payment verification failed',
			details: error.response?.data || error.message, // Return response details when available
		};
	}
};
export const verifyPayment = async (req, res) => {
	try {
		const { planId, paymentId } = req.body;
		const subscribed = await Subscription.findOne({ paymentId });
		if (subscribed) {
			return res.status(404).json({ subscription: subscribed });
		}
		// Verify the payment with Paystack
		const paymentData = await verifyPaystackPayment(paymentId);

		if (paymentData.status === 'success') {
			const userId = req.user._id;

			// 1. Get plan details
			const plan = await paymentId.findById(planId).select(
				'name price duration'
			);
			

			const { duration } = plan; // in days

			// 2. Check for existing active subscription
			const existingSubscription = await Subscription.findOne({
				userId,
				planId,
				status: 'active',
			});

			// 3. Calculate start and end dates
			const todayMidnight = startOfDay(new Date());

			let startDate;
			if (
				existingSubscription &&
				existingSubscription.endDate > todayMidnight
			) {
				startDate = startOfDay(new Date(existingSubscription.endDate)); // starts after existing ends
			} else {
				startDate = todayMidnight;
			}

			const endDate = startOfDay(addDays(startDate, duration));

			// 4. Create subscription
			const subscription = await Subscription.create({
				userId,
				planId,
				startDate,
				paymentId,
				endDate,
				status: 'active',
				description: `paystack ${paymentId}`,
			});

			console.log('Subscription created in database');
			res
				.status(200)
				.json({ message: 'Subscription created successfully', subscription });
		} else {
			res.status(400).json({
				message: 'Payment verification failed',
				details: paymentData,
			});
		}
	} catch (error) {
		console.error('Payment verification failed:', error);
		res.status(500).json({
			message: 'Payment verification failed',
			details: error.details,
		});
	}
};

export const paystackWebhook = async (req, res) => {
	try {
		const hash = crypto
			.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
			.update(JSON.stringify(req.body))
			.digest('hex');

		if (hash == req.headers['x-paystack-signature']) {
			const event = jsonData.event;

			// Handle different Paystack events based on the `event` field
			if (event === 'charge.success') {
				const { planId } = req.body;
				const userId = req.user._id;

				// 1. Get plan details
				const plan = await SubscriptionPlan.findById(planId).select(
					'name price duration'
				);
				if (!plan) {
					return res.status(404).json({ error: 'Plan not found' });
				}

				const { duration } = plan; // in days

				// 2. Check for existing active subscription
				const existingSubscription = await Subscription.findOne({
					userId,
					planId,
					status: 'active',
				});

				// 3. Calculate start and end dates
				const todayMidnight = startOfDay(new Date());

				let startDate;
				if (
					existingSubscription &&
					existingSubscription.endDate > todayMidnight
				) {
					startDate = startOfDay(new Date(existingSubscription.endDate)); // starts after existing ends
				} else {
					startDate = todayMidnight;
				}

				const endDate = startOfDay(addDays(startDate, duration));

				// 4. Create subscription
				const subscription = await Subscription.create({
					userId,
					planId,
					startDate,
					endDate,
					status: 'active',
				});

				res.status(200).json({ message: 'Success', subscription });
				console.log('Subscription created in database');
			} else {
				// Handle other Paystack events if needed
				console.log('Received Paystack event:', event);
				res.status(200).send('Event not handled');
			}
		} else {
			// Invalid signature, ignore the webhook event
			console.log('Invalid Paystack signature');
			res.status(400).send('Invalid signature');
		}
	} catch (error) {
		console.error('Error processing Paystack webhook:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
