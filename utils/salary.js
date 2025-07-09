/**
 * Calculate total salary based on salary structure
 * @param {Object} structure - The salary structure document
 * @returns {Object} - Detailed breakdown of salary calculation
 */
export const calculateSalaryFromStructure = (structure) => {
	if (!structure || typeof structure.basicSalary !== 'number') {
		throw new Error('Invalid salary structure provided.');
	}

	const basicSalary = structure.basicSalary;
	let totalAllowances = 0;
	let totalDeductions = 0;

	// Calculate total allowances
	if (Array.isArray(structure.allowances)) {
		for (const item of structure.allowances) {
			if (item.type === 'fixed') {
				totalAllowances += item.amount;
			} else if (item.type === 'percentage') {
				totalAllowances += (item.amount / 100) * basicSalary;
			}
		}
	}

	// Calculate total deductions
	if (Array.isArray(structure.deductions)) {
		for (const item of structure.deductions) {
			if (item.type === 'fixed') {
				totalDeductions += item.amount;
			} else if (item.type === 'percentage') {
				totalDeductions += (item.amount / 100) * basicSalary;
			}
		}
	}

	// Apply tax if any
	const tax = (structure.tax / 100) * basicSalary;

	const gross = basicSalary + totalAllowances;
	const net = gross - totalDeductions - tax;

	return {
		basicSalary,
		totalAllowances,
		totalDeductions,
		tax,
		grossSalary: gross,
		netSalary: net,
	};
};
