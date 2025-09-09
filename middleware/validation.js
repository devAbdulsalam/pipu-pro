// middleware/validation.js
import { body, validationResult } from 'express-validator';

export const validateCollection = [
	body('type').isIn(['rent', 'service_charge', 'rent_service_charge']),
	body('title').trim().isLength({ min: 1, max: 100 }),
	body('amount').isFloat({ min: 0 }),
	body('dueDate').isISO8601(),
	body('frequency').isIn(['monthly', 'one_time', 'bi_monthly', 'quarterly']),
	body('receivingAccount').isLength({ min: 1 }),
	body('tenants').isArray({ min: 1 }),
	body('tenants.*.phone').optional().isMobilePhone(),
	body('tenants.*.email').optional().isEmail(),
	body('tenants.*.name').trim().isLength({ min: 1 }),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: 'Validation failed',
				errors: errors.array(),
			});
		}
		next();
	},
];
