
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
import Payroll from '../../models/Payroll.js';
import Ticket from '../../models/Ticket.js';
import Meeting from '../../models/Meeting.js';

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
