import Visitor from '../models/Visitor.js';
import { generateUniqueCode } from '../utils/generateUniqueCode.js';

export const getGuestAdminDashboard = async (req, res) => {
	try {
		const visitor = await Visitor.findById(req.params.id).populate(
            'companyId createdBy',
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
export const getGuestStaffDashboard = async (req, res) => {
	try {
		const visitor = await Visitor.findById(req.params.id).populate(
            'companyId createdBy',
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
export const getGuestStaff = async (req, res) => {
	try {
		const visitor = await Visitor.findById(req.params.id).populate(
			'companyId createdBy',
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
		const visitor = await Visitor.findById(req.params.id).populate(
			'companyId createdBy',
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
export const getVisitorById = async (req, res) => {
	try {
		const visitor = await Visitor.findById(req.params.id).populate(
            'companyId createdBy',
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
			.populate('companyId createdBy')
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
		const { name, email, phone, expirationTime, companyId, createdBy } =
			req.body;

		const code = await generateUniqueCode(Visitor);

		const visitor = new Visitor({
			name,
			email,
			phone,
			expirationTime,
			companyId,
			createdBy,
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

		if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

		if (visitor.status === 'expired') {
			return res.status(400).json({ message: 'Visitor code has expired' });
		}

		visitor.checkIn = new Date();
		visitor.status = 'active';

		await visitor.save();

		res.status(200).json({ message: 'Check-in successful', visitor });
	} catch (error) {
		res.status(500).json({ message: 'Check-in failed', error: error.message });
	}
};

// Visitor Check-Out
export const visitorCheckOut = async (req, res) => {
	try {
		const { code } = req.params;

		const visitor = await Visitor.findOne({ code });

		if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

		visitor.checkOut = new Date();
		visitor.status = 'in-active';

		await visitor.save();

		res.status(200).json({ message: 'Check-out successful', visitor });
	} catch (error) {
		res.status(500).json({ message: 'Check-out failed', error: error.message });
	}
};

// Get Visitor by Code
export const getVisitorByCode = async (req, res) => {
	try {
		const { code } = req.params;

		const visitor = await Visitor.findOne({ code }).populate(
			'companyId createdBy',
			'name email'
		);

		if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

		res.status(200).json(visitor);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Failed to get visitor', error: error.message });
	}
};
