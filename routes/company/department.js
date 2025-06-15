import express from 'express';
import {
	requireAuth,
	verifyPermission,
	isCompany,
} from '../../middleware/requireAuth.js';
import {
	addDepartment,
	getDepartment,
	getDepartments,
	updateDepartment,
	deleteDepartment,
	addCategory,
	getCategory,
	getCategories,
	updateDepartmentCategory,
	deleteDepartmentCategory,
} from '../../controllers/company/department.js';

const router = express.Router();
router.get(
	'/departments',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getDepartments
);
router.get(
	'/departments/categories',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getCategories
);
router.get(
	'/departments/categories/:id',
	requireAuth,
	verifyPermission(['COMPANY']),
	isCompany,
	getCategory
);
router.get('/departments/:id', requireAuth, getDepartment);
router.post('/departments/categories', requireAuth, addCategory);
router.patch('/departments/categories', requireAuth, updateDepartmentCategory);
router.post('/departments', requireAuth, addDepartment);
router.patch('/departments', requireAuth, updateDepartment);
router.delete(
	'/departments/categories/:id',
	requireAuth,
	deleteDepartmentCategory
);
router.delete('/departments/:id', requireAuth, deleteDepartment);

export default router;
