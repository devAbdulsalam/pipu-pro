import Visitor from '../models/Visitor.js';
import VisitorLog from '../models/VisitorLog.js';
import Activity from '../models/Activity.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import { generateUniqueCode } from '../utils/generateUniqueCode.js';

export const getDashboard = async (req, res) => {
	try {
		const [totalEmployee, newHires, attendanceRate, staffLog] =
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
			]);
		res.status(200).json({
			totalEmployee,
			newHires,
			attendanceRate,
			staffLog,
		});
	} catch (error) {
		console.error('Error getting visitor:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getStaffs = async (req, res) => {
    try {
		const staff = await Employee.find({ companyId: req.params.companyId });
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