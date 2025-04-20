import Visitor from '../models/Visitor.js';
import VisitorLog from '../models/VisitorLog.js';
import { generateUniqueCode } from '../utils/generateUniqueCode.js';

export const getGuestAdminDashboard = async (req, res) => {
	try {
		const [totalHost, totalVisitors, activeStaff, staffLog] = await Promise.all(
			[
				Visitor.countDocuments({ ownerId: req.user._id }),
				Visitor.countDocuments({ ownerId: req.user._id }),
				Visitor.countDocuments({ ownerId: req.user._id, status: 'active' }),
				Visitor.find({ ownerId: req.user._id })
					.sort({ createdAt: -1 })
					.limit(50),
			]
		);
		res.status(200).json({
			totalHost,
			activeStaff,
			totalVisitors,
			staffLog,
		});
	} catch (error) {
		console.error('Error getting visitor:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getGuestStaffDashboard = async (req, res) => {
	try {
		const [totalVisitors, totalCheckedIn, totalCheckedOut, recentVisitors] =
			await Promise.all([
				Visitor.countDocuments({ ownerId: req.user._id }),
				VisitorLog.countDocuments({
					status: 'checkIn',
					ownerId: req.user._id,
				}),
				VisitorLog.countDocuments({
					status: 'checkOut',
					ownerId: req.user._id,
				}),
				Visitor.find({ ownerId: req.user._id })
					.sort({ createdAt: -1 })
					.limit(50),
			]);
		res.status(200).json({
			recentVisitors,
			totalCheckedIn,
			totalCheckedOut,
			totalVisitors,
		});
	} catch (error) {
		console.error('Error getting guest staff dashboard:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getGuestStaff = async (req, res) => {
	try {
		const visitor = await Visitor.findById(req.params.id).populate(
			'ownerId createdBy',
			'name email'
		);
		if (!visitor) {
			return res.status(404).send('Visitor not found');
		}
		res.status(200).json(visitor);
	} catch (error) {
		console.error('Error getting visitor:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getGuestHostDashboard = async (req, res) => {
	try {
		const [totalVisitors, totalCheckedIn, totalCheckedOut, recentVisitors] =
			await Promise.all([
				Visitor.countDocuments({ ownerId: req.user._id }),
				VisitorLog.countDocuments({
					status: 'checkIn',
					ownerId: req.user._id,
				}),
				VisitorLog.countDocuments({
					status: 'checkOut',
					ownerId: req.user._id,
				}),
				Visitor.find({ ownerId: req.user._id })
					.sort({ createdAt: -1 })
					.limit(50),
			]);
		res.status(200).json({
			recentVisitors,
			totalCheckedIn,
			totalCheckedOut,
			totalVisitors,
		});
	} catch (error) {
		console.error('Error getting guest host dashboard:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const getVisitorById = async (req, res) => {
	try {
		const visitor = await Visitor.findById(req.params.id).populate(
			'ownerId createdBy',
			'name email'
		);
		if (!visitor) {
			return res.status(404).send('Visitor not found');
		}
		res.status(200).json(visitor);
	} catch (error) {
		console.error('Error getting visitor:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

// Get Visitors by Company ID
export const getVisitors = async (req, res) => {
	try {
		const visitors = await Visitor.find()
			.populate('ownerId createdBy')
			.sort({ createdAt: -1 });
		res.status(200).json(visitors);
	} catch (error) {
		console.error('Error getting visitors:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
// Get Visitors by Company ID
export const getVisitorsByCompanyId = async (req, res) => {
	try {
		const visitors = await Visitor.find({ companyId: req.params.companyId });
		res.status(200).json(visitors);
	} catch (error) {
		console.error('Error getting visitors:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

// Create Visitor
export const createVisitor = async (req, res) => {
	try {
		const { name, email, phone, expirationTime, entryType, maxAccess } =
			req.body;

		const code = await generateUniqueCode(Visitor);

		const visitor = new Visitor({
			name,
			email,
			phone,
			entryType,
			maxAccess,
			expirationTime,
			ownerId: req.user._id,
			createdBy: req.user._id,
			code,
		});

		await visitor.save();

		res.status(201).json({ message: 'Visitor created successfully', visitor });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Failed to create visitor', error: error.message });
	}
};

// Visitor Check-In
export const visitorCheckIn = async (req, res) => {
	try {
		const { code } = req.params;

		const visitor = await Visitor.findOne({ code });

		if (!visitor) {
			return res.status(404).json({ message: 'Visitor not found' });
		}

		if (visitor.status === 'expired') {
			return res.status(400).json({ message: 'Visitor code has expired' });
		}
		if (visitor.expirationTime > new Date.now()) {
			visitor.status = 'expired';
			await visitor.save();
			return res.status(400).json({ message: 'Visitor code has expired' });
		}
		const log = await VisitorLog.create({
			statis: 'checkIn',
			ownerId: visitor.ownerId,
			visitorId: visitor._id,
		});
		visitor.checkIn = new Date();
		visitor.status = 'active';

		await visitor.save();

		res.status(200).json({ message: 'Check-in successful', visitor, log });
	} catch (error) {
		res.status(500).json({ message: 'Check-in failed', error: error.message });
	}
};

// Visitor Check-Out
export const visitorCheckOut = async (req, res) => {
	try {
		const { code } = req.params;

		const visitor = await Visitor.findOne({ code });

		if (!visitor) {
			return res.status(404).json({ message: 'Visitor not found' });
		}

		const log = await VisitorLog.create({
			statis: 'checkOut',
			ownerId: visitor.ownerId,
			visitorId: visitor._id,
		});

		visitor.checkOut = new Date();
		visitor.status = 'in-active';

		await visitor.save();

		res.status(200).json({ message: 'Check-out successful', visitor, log });
	} catch (error) {
		res.status(500).json({ message: 'Check-out failed', error: error.message });
	}
};

// Get Visitor by Code
export const getVisitorByCode = async (req, res) => {
	try {
		const { code } = req.params;

		const visitor = await Visitor.findOne({ code }).populate(
			'ownerId createdBy',
			'name email'
		);

		if (!visitor) {
			return res.status(404).json({ message: 'Visitor not found' });
		}

		res.status(200).json(visitor);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Failed to get visitor', error: error.message });
	}
};
