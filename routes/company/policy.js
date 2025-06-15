import express from 'express';
import {
	requireAuth,
	verifyPermission,
	isCompany,
} from '../../middleware/requireAuth.js';

import {
	getPolicy,
	updatePolicy,
	getFinancialPolicy,
	updateFinancialPolicy,
} from '../../controllers/company/policy.js';

const router = express.Router();
router.get(
	'/policy',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getPolicy
);
router.post('/policy', requireAuth, updatePolicy);
router.get(
	'/financial-policy',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getFinancialPolicy
);
router.post('/financial-policy', requireAuth, updateFinancialPolicy);

export default router;
