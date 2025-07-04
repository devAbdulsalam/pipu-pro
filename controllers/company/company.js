import mongoose from 'mongoose';
import Visitor from '../../models/Visitor.js';
import VisitorLog from '../../models/VisitorLog.js';
import User from '../../models/User.js';
import Activity from '../../models/Activity.js';
import Employee from '../../models/Employee.js';
import Attendance from '../../models/Attendance.js';
import Leave from '../../models/Leave.js';
import Company from '../../models/Company.js';
import Subscription from '../../models/Subscription.js';
import CompanyRole from '../../models/CompanyRole.js';
import Ticket from '../../models/Ticket.js';
import Meeting from '../../models/Meeting.js';
import { generateUniqueCode } from '../../utils/generateUniqueCode.js';
import { hash, verifyHash } from '../../utils/hash.js';
export const getDashboard = async (req, res) => {
	try {
		const company = req.company;
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

export const createCompany = async (req, res) => {
	try {
		const session = await mongoose.startSession();
		const { name, phone, email, password } = req.body;

		if (!name || !phone || !email || !password) {
			return res.status(400).json({ error: 'All fields are required' });
		}
		session.startTransaction();
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
					userId: user[0]._id,
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
export const updateCompany = async (req, res) => {
	try {
		const id = req.company._id;
		const { email } = req.body;
		const IsCompany = await Company.findOne({
			_id: { $ne: id },
			email,
		});
		const IsEmail = await User.findOne({
			email,
		});
		if (IsEmail || IsCompany) {
			return res.status(409).json({ error: 'Email Address already Exists' });
		}
		// write login to update the user and company, ensure the
		const company = await Company.findByIdAndUpdate(
			{ _id: id },
			{ ...req.body },
			{
				new: true,
			}
		);
		res.status(200).json({ company, message: 'Company updated successfully' });
	} catch (error) {
		console.error('Error updating company:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getRoles = async (req, res) => {
	try {
		const company = req.company;
		const roles = await CompanyRole.find({
			companyId: company._id,
		});

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
		const role = await CompanyRole.findById({
			_id: req.params.id,
		});
		if (!role) {
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
		const companyRole = await CompanyRole.findOne({
			name: req.body.name,
			companyId: req.body.companyId,
		});
		if (companyRole) {
			return res.status(409).json({ message: 'Role already exist' });
		}
		const role = await CompanyRole.create({ ...req.body });

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
		const role = await CompanyRole.findByIdAndUpdate(
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
export const getStaffs = async (req, res) => {
	try {
		const company = req.company;
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
		const company = req.company;
		const leaves = await Leave.find({ companyId: company._id });
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

export const getTickets = async (req, res) => {
	try {
		const companyId = req.company._id;
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
