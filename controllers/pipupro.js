import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import Visitor from '../models/Visitor.js';
import Role from '../models/Role.js';
import Admin from '../models/Admin.js';
// import Staff from '../models/Staff.js';
// import Guest from '../models/Guest.js';
import Payroll from '../models/Payroll.js';
import Transaction from '../models/Transactions.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
// import { generateUniqueCode } from '../utils/generateUniqueCode.js';

export const getDashboard = async (req, res) => {
	try {
		const roleCondition = { role: { $ne: 'ADMIN' } };
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
		const users = await User.find()
			.sort({ role: 1, createdAt: -1 })
			.select('-password');

		res.status(200).json(users);
	} catch (error) {
		console.error('Error getting accounts:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getAdmins = async (req, res) => {
	try {
		const admins = await User.find({ role: 'ADMIN' })
			.sort({ createdAt: -1 })
			.select('-password');

		res.status(200).json(admins);
	} catch (error) {
		console.error('Error getting admins:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getApprovals = async (req, res) => {
	try {
		const admins = await User.find({ role: 'admin' })
			.sort({ createdAt: -1 })
			.select('-password');

		res.status(200).json(admins);
	} catch (error) {
		console.error('Error getting approvals:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getConflictTickets = async (req, res) => {
	try {
		const admins = await User.find({ role: 'admin' })
			.sort({ createdAt: -1 })
			.select('-password');

		res.status(200).json(admins);
	} catch (error) {
		console.error('Error getting tickets:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const addAdmin = async (req, res) => {
	const session = await mongoose.startSession();
	try {
		const { name, email, position, password } = req.body;

		session.startTransaction();

		const existingUser = await User.findOne({ email }).session(session);
		if (existingUser) {
			await session.abortTransaction();
			return res.status(409).json({ error: 'Email address already exists' });
		}

		const hashedPassword = await hash(password, 10);

		const user = await User.create(
			[
				{
					name,
					email,
					password: hashedPassword,
					role: 'ADMIN',
				},
			],
			{ session }
		);

		const admin = await Admin.create(
			[
				{
					userId: user[0]._id,
					name,
					email,
					position,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		user[0].password = undefined;

		res.status(200).json({
			admin: staff[0],
			user: user[0],
			statusCode: 200,
			success: true,
			message: 'Admin added successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error('Error adding admin:', error);
		res.status(500).json({ error: error.message || 'Internal server error' });
	}
};
export const getFinances = async (req, res) => {
	try {
		const subs = await Subscription.find({
			status: 'active',
		}).populate('planId');
		const totalRevenue = subs.reduce((sum, sub) => {
			return sum + Number(sub.planId.price);
		}, 0);
		const [pendingPayroll, transactions, activeSubscribers] = await Promise.all(
			[
				Payroll.countDocuments({ status: { $ne: 'paid' } }),
				Transaction.find().sort({ createdAt: -1 }),
				Subscription.countDocuments({ status: 'active' }),
			]
		);
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
export const getSubscriptions = async (req, res) => {
	try {
		const subscribers = await Subscription.find()
			.select('userId paymentId planId')
			.populate('userId', 'name avatar email')
			.populate('planId')
			.populate('paymentId');
		res.status(200).json(subscribers);
	} catch (error) {
		console.error('Error getting subscriptions:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getSubscription = async (req, res) => {
	try {
		const subscription = await Subscription.find({ _id: req.params.id })
			.populate('userId', 'name avatar email')
			.populate('planId')
			.populate('paymentId');
		res.status(200).json(subscription);
	} catch (error) {
		console.error('Error getting subscription:', error);
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

export const getRoles = async (req, res) => {
	try {
		const roles = await Role.find();

		res.status(200).json(roles);
	} catch (error) {
		console.error('Error getting roles:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getRole = async (req, res) => {
	try {
		const role = await Role.findById({
			_id: req.params.id,
		});
		if (role) {
			return res.status(409).json({ message: 'Role not found!' });
		}

		res.status(200).json(role);
	} catch (error) {
		console.error('Error finding role:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const addRole = async (req, res) => {
	try {
		const role = await Role.create({ ...req.body });

		res.status(200).json(role);
	} catch (error) {
		console.error('Error creating role:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const updateRole = async (req, res) => {
	try {
		const role = await Role.findByIdAndUpdate(
			{ _id: req.body.roleId },
			req.params.id,
			req.body,
			{
				new: true,
			}
		);
		res.status(200).json(role);
	} catch (error) {
		console.error('Error updating role:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
