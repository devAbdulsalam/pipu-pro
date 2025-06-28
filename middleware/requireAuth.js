import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Employee from '../models/Employee.js';
import Role from '../models/Role.js';

dotenv.config();

export const requireAuth = async (req, res, next) => {
	// verify user is authenticated
	const { authorization } = req.headers;
	const token =
		req.cookies?.accessToken ||
		authorization?.split(' ')[1] ||
		req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ error: 'Authorization token required' });
	}
	try {
		const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findOne({ _id }).select('-password -refreshToken');

		if (!user) {
			return res.status(401).json({ error: 'Invalid access token' });
		}

		req.user = user;
		next();
	} catch (error) {
		// console.log(error);
		res.status(401).json({ error: 'Request is not authorized' });
	}
};

export const verifyPermission = (roles = []) => {
	return (req, res, next) => {
		try {
			if (!req.user?._id) {
				return res.status(401).json({ error: 'Unauthorized request' });
			}
			if (roles.includes(req.user.role)) {
				return next();
			}
			return res
				.status(403)
				.json({ error: 'You are not allowed to perform this action' });
		} catch (error) {
			console.error('Permission check error:', error);
			res.status(500).json({ error: 'Server error' });
		}
	};
};

export const verifyStatus = (statusList = []) => {
	return (req, res, next) => {
		try {
			if (!req.user?._id) {
				return res.status(401).json({ error: 'Unauthorized request' });
			}
			if (statusList.includes(req.user.status)) {
				return next();
			}
			return res.status(403).json({
				error:
					'You are not allowed to perform this action, contact admin for more information',
			});
		} catch (error) {
			console.error('Status check error:', error);
			res.status(500).json({ error: 'Server error' });
		}
	};
};
export const isAdmin = (req, res, next) => {
	if (req.user.role !== 'ADMIN') {
		return res.status(403).json({ error: 'Forbidden.' });
	}
	next();
};

export const isCompany = async (req, res, next) => {
	try {
		const company = await Company.findOne({ userId: req.user._id });
		if (!company) {
			return res.status(401).json({ error: 'Invalid company' });
		}
		req.company = company;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ error: 'Company Request is not authorized' });
	}
};
export const isStaff = async (req, res, next) => {
	try {
		const staff = await Employee.findOne({ userId: req.user._id });
		if (!staff) {
			return res.status(401).json({ error: 'Invalid staff ' });
		}
		req.staff = staff;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ error: 'Staff Request is not authorized' });
	}
};
export const checkPermission = (permissionName) => {
	return async (req, res, next) => {
		const user = req.user; // Assume user is attached to req after authentication
		const roles = await Role.find({ _id: { $in: user.roleIds } });
		const allowed = roles.some((role) =>
			role.permissions.some((p) => p.name === permissionName && p.isAllowed)
		);
		if (!allowed) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		next();
	};
};
