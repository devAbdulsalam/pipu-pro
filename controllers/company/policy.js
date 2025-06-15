import Financial from '../../models/Financial.js';
import CompanyPolicy from '../../models/CompanyPolicy.js';
export const updatePolicy = async (req, res) => {
	try {
		const policy = await CompanyPolicy.findOne({
			companyId: req.body.companyId,
		});
		if (!policy) {
			const newPolicy = await CompanyPolicy.create({ ...req.body });
			return res.status(200).json({
				policy: newPolicy,
				message: 'Company policy created successfully',
			});
		}
		const updatedPolicy = await CompanyPolicy.create({ ...req.body });

		res.status(200).json({
			policy: updatedPolicy,
			message: 'Company policy updated successfully',
		});
	} catch (error) {
		console.error('Error updating policy:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getPolicy = async (req, res) => {
	try {
		const companyId = req.company._id;
		const policy = await CompanyPolicy.findOne({companyId});
		res.status(200).json(policy);
	} catch (error) {
		console.error('Error getting policy:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const updateFinancialPolicy = async (req, res) => {
	try {
		const policy = await Financial.findOne({
			companyId: req.body.companyId,
		});
		if (!policy) {
			const newPolicy = await Financial.create({ ...req.body });
			return res.status(200).json({
				policy: newPolicy,
				message: 'Company financial policy created successfully',
			});
		}
		const updatedPolicy = await Financial.create({ ...req.body });

		res.status(200).json({
			policy: updatedPolicy,
			message: 'Company financial policy updated successfully',
		});
	} catch (error) {
		console.error('Error updating financial policy:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getFinancialPolicy = async (req, res) => {
	try {
		const companyId = req.company._id;
		const policy = await Financial.findOne({companyId});
		res.status(200).json(policy);
	} catch (error) {
		console.error('Error getting financial policy:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
