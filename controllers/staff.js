import Ticket from '../models/Ticket.js';
import Visitor from '../models/Visitor.js';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import Meeting from '../models/Meeting.js';
import Leave from '../models/Leave.js';
import Complaint from '../models/Complaint.js';
import Customer from '../models/Customer.js';
import Board from '../models/Board.js';
import Salary from '../models/Salary.js';
import VisitorLog from '../models/VisitorLog.js';
import { generateUniqueCode } from '../utils/generateUniqueCode.js';
import Payroll from '../models/Payroll.js';

export const getDashboard = async (req, res) => {
	try {
		const [totalWorkDays, totalTasksCompleted, pendingTasks, latestTasks] =
			await Promise.all([
				Attendance.countDocuments({ ownerId: req.user._id, status: 'active' }),
				Task.countDocuments({ ownerId: req.user._id }),
				Task.countDocuments({ ownerId: req.user._id }),
				Activity.find({ ownerId: req.user._id })
					.sort({ createdAt: -1 })
					.limit(50),
			]);
		res.status(200).json({
			totalWorkDays,
			totalTasksCompleted,
			pendingTasks,
			latestTasks,
		});
	} catch (error) {
		console.error('Error getting dashboard:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getTasks = async (req, res) => {
	try {
		const tasks = await Task.find({ companyId: req.params.companyId });
		res.status(200).json(tasks);
	} catch (error) {
		console.error('Error getting tasks:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getTask = async (req, res) => {
	try {
		const task = await Task.find({ companyId: req.params.companyId });
		res.status(200).json(task);
	} catch (error) {
		console.error('Error getting task:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const createTask = async (req, res) => {
	try {
		const task = await Task.create({ ...req.body });
		res.status(200).json(task);
	} catch (error) {
		console.error('Error creating task:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const updateTask = async (req, res) => {
	try {
		const task = await Task.findByIdAndUpdate(
			{ _id: req.params.id },
			{ ...req.body }
		);
		res.status(200).json(task);
	} catch (error) {
		console.error('Error updating task:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getAttendance = async (req, res) => {
	try {
		const attendance = await Attendance.find({
			userId: req.user._id,
		});
		res.status(200).json(attendance);
	} catch (error) {
		console.error('Error getting attendance:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const markAttendance = async (req, res) => {
	try {
		const {isGeoLocationEnabled, latitude, longitude} = req.body
		const employee = await Employee.findOne({ userId: req.user._id });
		if (!employee) {
			return res.status(400).json({ message: 'You are not an employee' });
		}
		// Check if the employee is already clocked in
		const alreadyClockedIn = await Attendance.findOne({
			userId: req.user._id,
			employeId: employee._id,
			clockOut: { $exists: false }, // Check if clockOut is not set
		});

		if (alreadyClockedIn) {
			return res.status(400).json({ message: 'You are already clocked in' });
		}
		// compare 700 meters with the employee's geolocation with google maps api		
		// // Check if the employee is within the allowed geolocation range
		// if (isGeoLocationEnabled) {
		// 	const isWithinRange = await checkIfWithinRange(
		// 		latitude,
		// 		longitude,
		// 		employee.latitude,
		// 		employee.longitude
		// 	);
		// 	if (!isWithinRange) {
		// 		return res
		// 			.status(400)
		// 			.json({ message: 'You are not within the allowed geolocation range' });
		// 	}
		// }
		const attendance = await Attendance.create({
			companyId: req.body.companyId,
			userId: req.user._id,
			employeId: employee._id,
			clockIn: Date.now(),
		});
		res.status(200).json(attendance);
	} catch (error) {
		console.error('Error marking attendance:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const clockOutAttendance = async (req, res) => {
	try {
		const employee = await Employee.findOne({ userId: req.user._id });
		if (!employee) {
			return res.status(400).json({ message: 'You are not an employee' });
		}
		const isclockedIn = await Attendance.findOne({
			userId: req.user._id,
			clockOut: { $exists: false },
		});
		if (!isclockedIn) {
			return res.status(400).json({ message: 'You are not clocked in' });
		}
		const attendance = await Attendance.findOneAndUpdate(
			{ _id: isclockedIn._id },
			{
				clockOut: Date.now(),
				status: 'present',
			},
			{ new: true }
		);
		res.status(200).json(attendance);
	} catch (error) {
		console.error('Error clocking out attendance:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getMyLeaveRequest = async (req, res) => {
	try {
		const leaves = await Leave.find({ staffId: req.staff._id });
		res.status(200).json(leaves);
	} catch (error) {
		console.error('Error getting leaves:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const sendLeaveRequest = async (req, res) => {
	try {
		const { startDate, days } = req.body;
		const staff = req.staff;
		if (!startDate || !days) {
			return res
				.status(400)
				.json({ message: 'Start date and days are required' });
		}
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + days - 1); // Calculate end date based on start date and days
		req.body.endDate = endDate;
		const leave = await Leave.create({
			...req.body,
			staffId: staff._id,
			companyId: staff.companyId,
			status: 'pending',
		});
		res.status(200).json(leave);
	} catch (error) {
		console.error('Error sending leave request:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const updateLeaveRequest = async (req, res) => {
	try {
		const { startDate, days, leaveId } = req.body;
		if (!startDate || !days) {
			return res
				.status(400)
				.json({ message: 'Start date and days are required' });
		}
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + days - 1); // Calculate end date based on start date and days
		req.body.endDate = endDate;
		const leave = await Leave.findByIdAndUpdate(
			{ _id: leaveId },
			{ ...req.body }
		);
		res.status(200).json(leave);
	} catch (error) {
		console.error('Error updating leave request:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getLeaveRequest = async (req, res) => {
	try {
		const leave = await Leave.find({ companyId: req.params.companyId });
		res.status(200).json(leave);
	} catch (error) {
		console.error('Error getting leave:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getBoardRooms = async (req, res) => {
	try {
		const boardrooms = await Board.find({ companyId: req.params.companyId });
		res.status(200).json(boardrooms);
	} catch (error) {
		console.error('Error getting boardrooms:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getMyPayroll = async (req, res) => {
	try {
		// const staff = req.staff;
		const payroll = await Salary.find({ employeeId: req.staff._Id });
		res.status(200).json(payroll);
	} catch (error) {
		console.error('Error getting payroll:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getMyPayrollHistory = async (req, res) => {
	try {
		const staff = req.staff;
		const payroll = await Payroll.find({ employes: { $in: [staff._id] } });
		res.status(200).json(payroll);
	} catch (error) {
		console.error('Error getting payroll history:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getVisitors = async (req, res) => {
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
		const meetings = await Meeting.find({ companyId: req.params.companyId });
		res.status(200).json(meetings);
	} catch (error) {
		console.error('Error getting meetings:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getCustomers = async (req, res) => {
	try {
		const customers = await Customer.find({ companyId: req.params.companyId });
		res.status(200).json(customers);
	} catch (error) {
		console.error('Error getting customers:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getTickets = async (req, res) => {
	try {
		const staff = req.staff;
		// console.log('Staff ID:', staff._id);
		// Fetch tickets created by the staff or assigned to them
		// const tickets = await Ticket.find();
		const tickets = await Ticket.find({
			$or: [{ createdBy: staff._id }, { assignedTo: { $in: [staff._id] } }],
		});

		res.status(200).json(tickets);
	} catch (error) {
		console.error('Error getting tickets:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const createTicket = async (req, res) => {
	try {
		const code = await generateUniqueCode(Ticket);
		const ticket = await Ticket.create({
			...req.body,
			createdBy: req.staff._id,
			code: code,
			companyId: req.staff.companyId,
		});
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
		const ticket = await Ticket.findByIdAndUpdate(
			{ _id: req.params.id },
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
export const getTicket = async (req, res) => {
	try {
		const ticket = await Ticket.findOne({ _id: req.params.id });
		if (!ticket) {
			return res.status(404).json({ message: 'Ticket not found' });
		}
		res.status(200).json(ticket);
	} catch (error) {
		console.error('Error getting ticket:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getComplaints = async (req, res) => {
	try {
		const complaints = await Complaint.find({
			companyId: req.params.companyId,
		});
		res.status(200).json(complaints);
	} catch (error) {
		console.error('Error getting complaints:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
