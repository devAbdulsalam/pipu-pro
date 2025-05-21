import mongoose from 'mongoose';
import Visitor from '../models/Visitor.js';
import VisitorLog from '../models/VisitorLog.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Company from '../models/Company.js';
import Subscription from '../models/Subscription.js';
import Payroll from '../models/Payroll.js';
import Ticket from '../models/Ticket.js';
import { generateUniqueCode } from '../utils/generateUniqueCode.js';
import { hash, verifyHash } from '../utils/hash.js';
export const getDashboard = async (req, res) => {
	try {
		const company = await Company.find({ userId: req.user._id });
		if (!company) {
			return res.status(404).json({ message: 'Company not found' });
		}
		const [totalEmployee, newHires, attendanceRate, staffLog, subscription] =
			await Promise.all([
				Employee.countDocuments({ companyId: req.user._id }),
				Employee.countDocuments({ companyId: req.user._id }),
				Attendance.countDocuments({
					companyId: req.user._id,
					status: 'active',
				}),
				Activity.find({ ownerId: req.user._id })
					.sort({ createdAt: -1 })
					.limit(50),
				Subscription.findOne({ userId: req.user._id }).sort({ createdAt: -1 }), // or .sort({ endDate: -1 }) depending on your data,
			]);
		res.status(200).json({
			company,
			totalEmployee,
			newHires,
			attendanceRate,
			staffLog,
			subscription: subscription || null,
		});
	} catch (error) {
		console.error('Error getting company dashboard:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getStaffs = async (req, res) => {
	try {
		const company = await Company.findOne({ userId: req.user._id });
		if (!company) {
			return res.status(404).json({ message: 'Company not found' });
		}
		const staff = await Employee.find({ companyId: company._id }).populate(
			'userId'
		);
		res.status(200).json(staff);
	} catch (error) {
		console.error('Error getting staff:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const createCompany = async (req, res) => {
	try {
		const { name, phone, email, password } = req.body;

		await session.commitTransaction();
		session.endSession();

		user[0].password = undefined;
		const isComapny = await Company.findOne({ name: name });
		if (isComapny) {
			await session.abortTransaction();
			return res
				.status(409)
				.json({ error: 'Company with name already Exists' });
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			await session.abortTransaction();
			return res.status(409).json({ error: 'Email Address already Exists' });
		}

		// const password = generateUniqueCode();
		const hashedPassword = await hash(password);

		const user = await User.create(
			[
				{
					name,
					email,
					phone,
					password: hashedPassword,
					role: 'COMPANY',
				},
			],
			{ session }
		);
		const company = await Company.create(
			[
				{
					userId: user._id,
					name,
					email,
					status: 'inactive',
				},
			],
			session
		);

		await session.commitTransaction();
		session.endSession();

		user[0].password = undefined;

		res.status(200).json({
			company,
			user,
			statusCode: 200,
			success: true,
			message: 'Company added successfully',
		});
	} catch (error) {
		console.error('Error getting staff:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const addStaff = async (req, res) => {
	const session = await mongoose.startSession();

	try {
		const { companyId, name, phone, email, department, position, password } =
			req.body;

		session.startTransaction();

		const isCompany = await Company.findById(companyId).session(session);
		if (!isCompany) {
			await session.abortTransaction();
			return res.status(401).json({ error: 'Invalid company' });
		}

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
					phone,
					password: hashedPassword,
					role: 'STAFF',
				},
			],
			{ session }
		);

		const staff = await Employee.create(
			[
				{
					companyId,
					userId: user[0]._id,
					name,
					email,
					position,
					department,
				},
			],
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		user[0].password = undefined;

		res.status(200).json({
			staff: staff[0],
			user: user[0],
			statusCode: 200,
			success: true,
			message: 'Personnel added successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error('Error adding staff:', error);
		res.status(500).json({ error: error.message || 'Internal server error' });
	}
};

export const getStaff = async (req, res) => {
	try {
		const staff = await Employee.find({ _id: req.params.id });
		res.status(200).json(staff);
	} catch (error) {
		console.error('Error getting staff:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getLeaves = async (req, res) => {
	try {
		const leaves = await Leave.find({ companyId: req.params.companyId });
		res.status(200).json(leaves);
	} catch (error) {
		console.error('Error getting leaves:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getLeavesRequest = async (req, res) => {
	try {
		const leaveRequest = await Leave.findById(req.params.id);
		res.status(200).json(leaveRequest);
	} catch (error) {
		console.error('Error getting leaveRequest:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const payrollDashboard = async (req, res) => {
	try {
		const payrolls = await Payroll.find({
			companyId: req.params.companyId,
		});
		res.status(200).json(payrolls);
	} catch (error) {
		console.error('Error getting payroll dashboard:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const payrollHistory = async (req, res) => {
	try {
		const payrolls = await Payroll.find({
			companyId: req.params.companyId,
			status: 'paid',
		});
		res.status(200).json(payrolls);
	} catch (error) {
		console.error('Error getting payrolls:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const addPayroll = async (req, res) => {
	try {
		const payrolls = await Payroll.find({ companyId: req.params.companyId });
		res.status(200).json(payrolls);
	} catch (error) {
		console.error('Error getting payrolls:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const draftPayroll = async (req, res) => {
	try {
		const payrolls = await Payroll.find({ companyId: req.params.companyId });
		res.status(200).json(payrolls);
	} catch (error) {
		console.error('Error drafting payrolls:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const payrollDrafts = async (req, res) => {
	try {
		const payrolls = await Payroll.find({
			companyId: req.params.companyId,
			status: 'draft',
		});
		res.status(200).json(payrolls);
	} catch (error) {
		console.error('Error getting draft payrolls:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getPayroll = async (req, res) => {
	try {
		const payrolls = await Payroll.find({ companyId: req.params.companyId });
		res.status(200).json(payrolls);
	} catch (error) {
		console.error('Error getting payrolls:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const createMeeting = async (req, res) => {
	try {
		const visitors = await Visitor.find({ companyId: req.params.companyId });
		res.status(200).json(visitors);
	} catch (error) {
		console.error('Error getting visitors:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getMeetings = async (req, res) => {
	try {
		const visitors = await Visitor.find({ companyId: req.params.companyId });
		res.status(200).json(visitors);
	} catch (error) {
		console.error('Error getting meetings:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getMeeting = async (req, res) => {
	try {
		const visitors = await Visitor.find({ companyId: req.params.companyId });
		res.status(200).json(visitors);
	} catch (error) {
		console.error('Error getting meetings:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getBoardRooms = async (req, res) => {
	try {
		const visitors = await Visitor.find({ companyId: req.params.companyId });
		res.status(200).json(visitors);
	} catch (error) {
		console.error('Error getting boardrooms:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const createTicket = async (req, res) => {
	try {
		const companyId = req.user._id;
		const createdBy = req.user._id;
		const ticket = await Ticket.create({ companyId, createdBy, ...req.body });
		res.status(200).json(ticket);
	} catch (error) {
		console.error('Error getting ticket:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getTickets = async (req, res) => {
	try {
		const companyId = '681e2429c5421ead94648571';
		// const companyId = req.user._id;
		const tickets = await Ticket.find({ companyId });
		res.status(200).json(tickets);
	} catch (error) {
		console.error('Error getting tickets:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getTicket = async (req, res) => {
	try {
		const ticket = await Ticket.findOne({ _id: req.params.id });
		res.status(200).json(ticket);
	} catch (error) {
		console.error('Error getting ticket:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const updateTicket = async (req, res) => {
	try {
		const ticketId = req.body.ticketId;
		if (!ticketId) {
			return res.status(400).json({ error: 'Ticket Id is required' });
		}
		const ticket = await Ticket.findByIdAndUpdate(
			{ _id: ticketId },
			{ ...req.body }
		);
		res.status(200).json(ticket);
	} catch (error) {
		console.error('Error updating ticket:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
