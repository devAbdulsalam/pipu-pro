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
import Chat from '../models/Chat.js';
import VisitorLog from '../models/VisitorLog.js';
import { generateUniqueCode } from '../utils/generateUniqueCode.js';

export const getDashboard = async (req, res) => {
	try {
		const [totalHost, totalVisitors, activeStaff, staffLog] = await Promise.all(
			[
				Visitor.countDocuments({ ownerId: req.user._id }),
				Visitor.countDocuments({ ownerId: req.user._id }),
				Visitor.countDocuments({ ownerId: req.user._id, status: 'active' }),
				Activity.find({ ownerId: req.user._id })
					.sort({ createdAt: -1 })
					.limit(50),
			]
		);
		res.status(200).json({
			totalHost,
			activeStaff,
			totalVisitors,
			staffLog,
		});
	} catch (error) {
		console.error('Error getting visitor:', error);
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
		const task = await Task.create({ ...req.body});
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
		const task = await Task.findByIdAndUpdate({ _id: req.params.id }, {...req.body});
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
		const employee = await Employee.findOne({ userId: req.user._id });
		if(!employee){
			return res.status(400).json({ message: 'You are not an employee' })
		}
		const attendance = await Attendance.create({
			companyId: req.body.companyId,
			userId: req.user._id,
			employeId: employee._id,
			checkIn: Date.now(),
		});
		res.status(200).json(attendance);
	} catch (error) {
		console.error('Error marking attendance:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const checkOutAttendance = async (req, res) => {
	try {
		const isCheckedIn = await Attendance.findOneAndUpdate({
			userId: req.user._id,
			createdAt: -1,
		});
		if (!isCheckedIn) {
			return res.status(400).json({ message: 'You are not checked in' })
		}
		const attendance = await Attendance.findOneAndUpdate({_id: isCheckedIn._id}, {
			checkOut: Date.now(),
			status: 'present',
		});
		res.status(200).json(attendance);
	} catch (error) {
		console.error('Error checking out attendance:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getMyLeaveRequest = async (req, res) => {
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
export const sendLeaveRequest = async (req, res) => {
	try {
		const leave = await Leave.create(req.body);
		res.status(200).json(leave);
	} catch (error) {
		console.error('Error sending leave request:', error);
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
		const visitors = await Visitor.find({ companyId: req.params.companyId });
		res.status(200).json(visitors);
	} catch (error) {
		console.error('Error getting visitors:', error);
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
		const tickets = await Ticket.find({ companyId: req.params.companyId });
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
		const ticket = await Ticket.create(req.body);
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
		const ticket = await Ticket.findByIdAndUpdate({ _id: req.params.id }, { ...req.body });
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
		const ticket = await Ticket.find({ _id: req.params.id });
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
		const complaints = await Complaint.find({ companyId: req.params.companyId });
		res.status(200).json(complaints);
	} catch (error) {
		console.error('Error getting complaints:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
