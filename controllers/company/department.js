import Department from '../../models/Department.js';
import DepartmentCategory from '../../models/DepartmentCategory.js';
export const addCategory = async (req, res) => {
	try {
		const { name, companyId } = req.body;
		if (!name || !companyId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		const isCategory = await DepartmentCategory.findOne({
			name: req.body.name,
			companyId: req.body.companyId,
		});
		if (isCategory) {
			return res.status(409).json({ message: 'Category already exist' });
		}
		const category = await DepartmentCategory.create({
			companyId: req.body.companyId,
			name: req.body.name,
		});

		res.status(200).json(category);
	} catch (error) {
		console.error('Error creating department category:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getCategories = async (req, res) => {
	try {
		const companyId = req.company._id;
		const categories = await DepartmentCategory.find({ companyId });

		res.status(200).json(categories);
	} catch (error) {
		console.error('Error getting categories:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getCategory = async (req, res) => {
	try {
		const categoryId = req.params.id;
		const category = await DepartmentCategory.findOne({ _id: categoryId });

		res.status(200).json(category);
	} catch (error) {
		console.error('Error getting category:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getDepartments = async (req, res) => {
	try {
		const companyId = req.company._id;
		const departments = await Department.find({ companyId });

		res.status(200).json(departments);
	} catch (error) {
		console.error('Error getting departments:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getDepartment = async (req, res) => {
	try {
		const department = await Department.findById({
			_id: req.params.id,
		});

		res.status(200).json(department);
	} catch (error) {
		console.error('Error getting department:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const addDepartment = async (req, res) => {
	try {
		const { name, companyId, categoryId } = req.body;
		if (!name || !companyId || !categoryId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		const isCategory = await DepartmentCategory.findOne({ _id: categoryId });
		if (!isCategory) {
			return res.status(400).json({ error: 'Category does not exist' });
		}
		const isDepartment = await Department.findOne({
			name: req.body.name,
			companyId: req.body.companyId,
		});
		if (isDepartment) {
			return res.status(409).json({ message: 'Department already exist' });
		}
		const department = await Department.create({
			_id: req.params.id,
			...req.body,
		});

		res.status(200).json(department);
	} catch (error) {
		console.error('Error getting department:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const updateDepartmentCategory = async (req, res) => {
	try {
		const { name, categoryId } = req.body;
		if (!name || !categoryId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		const category = await DepartmentCategory.findByIdAndUpdate(
			{
				_id: categoryId,
			},
			{ ...req.body },
			{
				new: true,
			}
		);

		res.status(200).json({ category, message: 'Category updated succesfully' });
	} catch (error) {
		console.error('Error updating department:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const updateDepartment = async (req, res) => {
	try {
		const { name, departmentId, categoryId } = req.body;
		if (!name || !departmentId || !categoryId) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		console.log('req.body', req.body);
		const isCategory = await DepartmentCategory.findOne({ _id: categoryId });
		if (!isCategory) {
			return res.status(400).json({ error: 'Category does not exist' });
		}
		const category = await Department.findByIdAndUpdate(
			{
				_id: departmentId,
			},
			{ ...req.body },
			{
				new: true,
			}
		);

		res
			.status(200)
			.json({ category, message: 'Department updated succesfully' });
	} catch (error) {
		console.error('Error updating department:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const deleteDepartmentCategory = async (req, res) => {
	try {
		const categoryId = req.params.id;
		if (!categoryId) {
			return res.status(400).json({ message: 'category ID is required!' });
		}
		const data = await DepartmentCategory.findByIdAndDelete(categoryId);
		if (!data) {
			return res.status(404).json({ message: 'Blog not found!' });
		}
		res
			.status(200)
			.json({ message: 'Department category deleted successfully' });
	} catch (e) {
		console.log('Error deleting department category', e);
		res.status(400).json(e.message);
	}
};
export const deleteDepartment = async (req, res) => {
	try {
		const departmentId = req.params.id;
		if (!departmentId) {
			return res.status(400).json({ message: 'Department ID is required!' });
		}
		const data = await Department.findByIdAndDelete(departmentId);
		if (!data) {
			return res.status(404).json({ message: 'Blog not found!' });
		}
		res.status(200).json({ message: 'Department deleted successfully' });
	} catch (e) {
		console.log('Error deleting Department', e);
		res.status(400).json(e.message);
	}
};
