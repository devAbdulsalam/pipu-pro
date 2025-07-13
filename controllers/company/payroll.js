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
import CompanyPolicy from '../../models/CompanyPolicy.js';
import Salary from '../../models/Salary.js';
import SalaryStructure from '../../models/SalaryStructure.js';
import { calculateSalaryFromStructure } from '../../utils/salary.js';

export const updateSalaryStructure = async (req, res) => {
	try {
		const { id } = req.params;
		const structure = await SalaryStructure.findById(id);

		console.log('result', result);

		const result = calculateSalaryFromStructure(structure);

		res.status(200).json({ structure, result });
	} catch (error) {
		console.error('Error getting salary structure:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const getSalaryStructures = async (req, res) => {
	try {
		const id = req.company._id;
		const structures = await SalaryStructure.find({ companyId: id });
		res.status(200).json(structures);
	} catch (error) {
		console.error('Error getting salary structure:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const getSalaryStructure = async (req, res) => {
	try {
		const { id } = req.params;
		const structure = await SalaryStructure.findById(id);

		console.log('result', result);

		const result = calculateSalaryFromStructure(structure);

		res.status(200).json({ structure, result });
	} catch (error) {
		console.error('Error getting salary structure:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const generateSalary = async (req, res) => {
	try {
		const {
			employeeId,
			companyId,
			basicSalary,
			bonus = 0,
			deductions = 0,
			tax = 0,
		} = req.body;
		const ownerId = req.user._id;

		const amount = basicSalary + bonus - (deductions + tax);

		const salary = await Salary.findOneAndUpdate(
			{ employeeId, companyId },
			{
				ownerId,
				employeeId,
				companyId,
				basicSalary,
				bonus,
				deductions,
				tax,
				amount,
			},
			{ new: true, upsert: true }
		);

		res.status(200).json({ message: 'Salary generated', salary });
	} catch (error) {
		console.error('Error generating salary:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
export const paySalary = async (req, res) => {
	try {
		const { salaryId } = req.params;
		const { basicSalary, bonus = 0, deductions = 0, tax = 0 } = req.body;

		const amount = basicSalary + bonus - (deductions + tax);

		const updated = await Salary.findByIdAndUpdate(
			salaryId,
			{ basicSalary, bonus, deductions, tax, amount },
			{ new: true }
		);

		if (!updated) return res.status(404).json({ message: 'Salary not found' });

		res.status(200).json({ message: 'Salary updated', updated });
	} catch (error) {
		console.error('Error updating salary:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const updateSalary = async (req, res) => {
	try {
		const { salaryId } = req.params;
		const { basicSalary, bonus = 0, deductions = 0, tax = 0 } = req.body;

		const amount = basicSalary + bonus - (deductions + tax);

		const updated = await Salary.findByIdAndUpdate(
			salaryId,
			{ basicSalary, bonus, deductions, tax, amount },
			{ new: true }
		);

		if (!updated) return res.status(404).json({ message: 'Salary not found' });

		res.status(200).json({ message: 'Salary updated', updated });
	} catch (error) {
		console.error('Error updating salary:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const generatePayroll = async (req, res) => {
	try {
		const companyId = req.company._id;
		const salaries = await Salary.find({ companyId });

		const employees = salaries.map((salary) => ({
			employeeId: salary.employeeId,
			amount: salary.amount,
			dateProcessed: new Date(),
		}));

		const payroll = await Payroll.create({
			companyId,
			employees,
			status: 'draft',
		});

		res.status(201).json({ message: 'Payroll generated', payroll });
	} catch (error) {
		console.error('Error generating payroll:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const approvePayroll = async (req, res) => {
	try {
		const { payrollId, reason } = req.body;
		const approvedBy = req.user._id;

		const approved = await Payroll.findByIdAndUpdate(
			payrollId,
			{
				status: 'pending',
				approval: {
					approvedBy,
					reason,
					approvedAt: new Date(),
				},
			},
			{ new: true }
		);

		if (!approved)
			return res.status(404).json({ message: 'Payroll not found' });

		res.status(200).json({ message: 'Payroll approved', approved });
	} catch (error) {
		console.error('Error approving payroll:', error);
		res.status(500).json({ error: 'Internal Server Error' });
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
export const getPayrolls = async (req, res) => {
	try {
		const query = req.query.status ? { status: req.query.status } : {};
		const payrolls = await Payroll.find({ companyId: req.params.companyId });
		res.status(200).json(payrolls);
	} catch (error) {
		console.error('Error getting payrolls:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getPayroll = async (req, res) => {
	try {
		const payroll = await Payroll.findById(req.params.id);
		res.status(200).json(payroll);
	} catch (error) {
		console.error('Error getting payroll:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
