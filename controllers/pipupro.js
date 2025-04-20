import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import Visitor from '../models/Visitor.js';
import Company from '../models/Company.js';
// import Staff from '../models/Staff.js';
// import Guest from '../models/Guest.js';
import Transaction from '../models/Transactions.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
// import { generateUniqueCode } from '../utils/generateUniqueCode.js';

export const getDashboard = async (req, res) => {
	try {
		const roleCondition = { role: { $ne: 'admin' } };
		// Run counts in parallel for performance
		const [totalUsers, activeUsers, recentUsers, activeSubscribers] =
			await Promise.all([
				User.countDocuments(roleCondition),
				User.countDocuments({ status: 'active', roleCondition }),
				User.find(roleCondition)
					.sort({ createdAt: -1 })
					.select('-password') // select only needed fields
					.limit(50),
				Subscription.countDocuments({ status: 'active' }),
			]);

		res.status(200).json({
			totalUsers,
			activeUsers,
			activeSubscribers,
			recentUsers,
		});
	} catch (error) {
		console.error('Error getting dashboard data:', error);
		res.status(500).json({
			error: error.message || 'Internal server error',
		});
	}
};

export const getAccounts = async (req, res) => {
	try {
		const users = await User.find().sort({ createdAt: -1 }).select('-password');

		res.status(200).json(users);
	} catch (error) {
		console.error('Error getting accounts:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getFinances = async (req, res) => {
	try {
		const [totalRevenue, pendingPayroll, transactions, activeSubscribers] =
			await Promise.all([
				Subscription.countDocuments({ status: 'active' }),
				Subscription.countDocuments({ status: 'active' }),
				Transaction.find().sort({ createdAt: -1 }),
				Subscription.countDocuments({ status: 'active' }),
			]);
		res.status(200).json({
			totalRevenue,
			activeSubscribers,
			pendingPayroll,
			transactions,
		});
	} catch (error) {
		console.error('Error getting finances:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getSubscriptionPrices = async (req, res) => {
	try {
		const plans = await SubscriptionPlan.find().select('name price');
		res.status(200).json({ plans });
	} catch (error) {
		console.error('Error getting plans:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const createSubscriptionPlan = async (req, res) => {
	try {
		const newPlan = await SubscriptionPlan.create(req.body);
		res.status(200).json({
			newPlan,
			message: 'Subscription plan created successfully',
		});
	} catch (error) {
		console.error('Error creating plans:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const updateSubscriptionPrices = async (req, res) => {
	try {
		const { plans } = req.body;

		const updatedPlans = await Promise.all(
			plans.map(({ id, price }) =>
				SubscriptionPlan.findByIdAndUpdate(id, { price }, { new: true })
			)
		);

		res.status(200).json({
			plans: updatedPlans,
			message: 'Subscription prices updated successfully',
		});
	} catch (error) {
		console.error('Error updating subscription prices:', error);
		res.status(500).json({
			error: error.message || 'Internal server error',
		});
	}
};

