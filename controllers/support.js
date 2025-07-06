import Support from '../models/Support.js';
import User from '../models/User.js';

// Report a user
export const reportIssue = async (req, res) => {
	const { reason, category } = req.body;

	try {
		const report = await Support.create({
			reportedBy: req.user._id,
			reason,
			category,
		});

		res.status(201).json({ message: 'Issue reported successfully', report });
	} catch (error) {
		console.log('error', error);
		res
			.status(500)
			.json({ message: 'Failed to report issue', error: error.message });
	}
};

export const editReport = async (req, res) => {
	const { reason, category } = req.body;

	try {
		const report = await Support.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				reportedBy: req.user._id,
				reason,
				category,
			}
		);

		res.status(201).json({ message: 'Issue updated successfully', report });
	} catch (error) {
		console.log('error', error);
		res
			.status(500)
			.json({ message: 'Failed to update report', error: error.message });
	}
};

// Get all reports
export const getReports = async (req, res) => {
	try {
		const userRoles = req.user.role;
		if (userRoles === 'ADMIN' || userRoles === 'SUPERADMIN') {
			const reports = await Support.find()
				.select('-replies')
				.sort({ createdAt: -1 });
			return res.status(200).json(reports);
		} else {
			const reports = await Support.find({ reportedBy: req.user._id }).sort({
				createdAt: -1,
			});
			return res.status(200).json(reports);
		}
	} catch (error) {
		console.log('error', error);
		res
			.status(500)
			.json({ message: 'Failed to retrieve reports', error: error.message });
	}
};
// Get all reports
export const getReport = async (req, res) => {
	try {
		const reports = await Support.findById(req.params.id).populate([
			{
				path: 'reportedBy',
				select: 'name role profileImage', // Selecting specific fields
			},
			{
				path: 'replies.from',
				select: 'name role profileImage', // Selecting specific fields
			},
		]);
		res.status(200).json(reports);
	} catch (error) {
		console.log('error', error);
		res
			.status(500)
			.json({ message: 'Failed to retrieve reports', error: error.message });
	}
};
export const getUserReports = async (req, res) => {
	try {
		const reports = await Support.find({ reportedBy: req.user._id })
			.populate('reportedBy', 'name email')
			.sort({ createdAt: -1 });
		res.status(200).json(reports);
	} catch (error) {
		console.log('error', error);
		res
			.status(500)
			.json({ message: 'Failed to retrieve reports', error: error.message });
	}
};

// Handle a report
export const handleReport = async (req, res) => {
	const { reportId, action } = req.body;

	try {
		const report = await Support.findById(reportId);

		if (!report) {
			return res.status(404).json({ message: 'Report not found' });
		}
		const newReport = await Support.findByIdAndUpdate(
			reportId,
			{ status: action },
			{ new: true }
		);

		res
			.status(200)
			.json({ message: 'Report handled successfully', report: newReport });
	} catch (error) {
		console.log('error', error);
		res
			.status(500)
			.json({ message: 'Failed to handle report', error: error.message });
	}
};

export const replyReport = async (req, res) => {
	const { message } = req.body;

	try {
		if (!message) {
			return res.status(404).json({ message: 'message is required!' });
		}
		const report = await Support.findById(req.params.id);

		if (!report) {
			return res.status(404).json({ message: 'Report not found' });
		}
		report.replies.push({
			from: req.user._id,
			message,
			status: 'pending',
		});
		await report.save();

		res.status(200).json({ message: 'Reply added successfully', report });
	} catch (error) {
		console.log('error', error);
		res
			.status(500)
			.json({ message: 'Failed to add reply', error: error.message });
	}
};
