import express from 'express';
import {
    payrollDashboard,
    payrollHistory,
    addPayroll,
    getPayroll,
    draftPayroll,
    payrollDrafts,
} from '../../controllers/company/payroll.js';
import { requireAuth, verifyPermission } from '../../middleware/requireAuth.js';
const router = express.Router();
router.get('/payroll-dashboard', requireAuth, payrollDashboard);
router.get('/payroll-history', requireAuth, payrollHistory);
router.get('/payroll-drafts', requireAuth, payrollDrafts);
router.post('/payroll-drafts', requireAuth, draftPayroll);
router.get('/payrolls', requireAuth, payrollDashboard);
router.post('/payrolls', requireAuth, addPayroll);
router.get('/payrolls/:id', requireAuth, getPayroll);

export default router;
