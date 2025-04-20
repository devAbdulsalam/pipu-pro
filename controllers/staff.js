import Ticket from '../models/Ticket.js';
import Visitor from '../models/Visitor.js';
import Task from '../models/Task.js';
import BoardRoom from '../models/BoardRoom.js';
import Meeting from '../models/Meeting.js';
import Leave from '../models/Leave.js';
import Complaint from '../models/Complaint.js';
import Customer from '../models/Customer.js';
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
				Visitor.find({ ownerId: req.user._id })
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
export const getTask = async (req, res) => {
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
export const getLeave = async (req, res) => {
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

export const getLeaveRequest = async (req, res) => {
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
export const getBoardRooms = async (req, res) => {
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
export const payroll = async (req, res) => {
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
		const visitors = await Visitor.find({ companyId: req.params.companyId });
		res.status(200).json(visitors);
	} catch (error) {
		console.error('Error getting visitors:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getCustomers = async (req, res) => {
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
export const getTickets = async (req, res) => {
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
export const createTicket = async (req, res) => {
    try {
        const ticket = await Ticket.find({ companyId: req.params.companyId });
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error getting ticket:', error);
        return res
            .status(500)
            .json({ error: error.message || 'Internal server error' });
    }
};
export const getTicket = async (req, res) => {
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
export const getComplaints = async (req, res) => {
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