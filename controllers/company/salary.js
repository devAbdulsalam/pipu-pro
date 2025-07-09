import CompanyPolicy from '../../models/CompanyPolicy.js';
import Employee from '../../models/Employee.js';
import Salary from '../../models/Salary.js';
import SalaryStructure from '../../models/SalaryStructure.js';
import Payroll from '../../models/Payroll.js';
import { calculateSalaryFromStructure } from '../../utils/salary';

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
		const { companyId } = req.body;

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
		const { payrollId } = req.params;
		const { reason } = req.body;
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

/* Output:
{
  basicSalary: 50000,
  totalAllowances: 15000,
  totalDeductions: 2500,
  tax: 2500,
  grossSalary: 65000,
  netSalary: 60000
}
*/
