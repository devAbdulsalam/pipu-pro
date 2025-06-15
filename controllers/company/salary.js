import CompanyPolicy from '../../models/CompanyPolicy.js';
import Salary from '../../models/Salary.js';
import SalaryStructure from '../../models/SalaryStructure.js';
import Payroll from '../../models/Payroll.js';
import Employee from '../../models/Employee.js';

export const paySalary = async (req, res) => {
	try {
		const policy = await CompanyPolicy.findOne();
		const salary = await Salary.findOne();
		const salaryStructure = await SalaryStructure.findOne();
		const payroll = await Payroll.findOne();
		const employee = await Employee.findOne();

		res.status(200).json(users);
	} catch (error) {
		console.error('Error getting accounts:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
