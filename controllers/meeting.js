import Visitor from '../models/Visitor.js';
import VisitorLog from '../models/VisitorLog.js';
import Activity from '../models/Activity.js';
import { generateUniqueCode } from '../utils/generateUniqueCode.js';
import Meeting from '../models/Meeting.js';


export const getMeetings = async (req, res) => {
	try {
		const meeting = await Meeting.find({ companyId: req.params.companyId });
		res.status(200).json(meeting);
	} catch (error) {
		console.error('Error getting meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getMeeting = async (req, res) => {
	try {
		const meeting = await Meeting.find({ _id: req.params.companyId });
		res.status(200).json(meeting);
	} catch (error) {
		console.error('Error getting meetings:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getMyMeetings = async (req, res) => {
	try {
		const meeting = await Meeting.find({
			participants: req.user._id,
			status: { $in: ['scheduled', 'active'] },
		});
		res.status(200).json(meeting);
	} catch (error) {
		console.error('Error getting meetings:', error);
		return res.status(500).json({
			error: error.message || 'Internal server error',
		});
	}
};
export const updateMeeting = async (req, res) => {
	try {
		const { title, description, date, time, duration, maxUsers } = req.body;
		const meeting = await Meeting.findByIdAndUpdate(
			req.params.id,
			{ title, description, date, time, duration, maxUsers },
			{ new: true }
		);
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		res.status(200).json(meeting);
	} catch (error) {
		console.error('Error updating meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const createMeeting = async (req, res) => {
	try {
		const {
			title,
			description,
			startTime,
			date,
			duration,
			maxUsers,
			participants,
		} = req.body;
		const meetingId = await generateUniqueCode(Meeting);
		const newMeeting = new Meeting({
			title,
			description,
			maxUsers,
			date,
			startTime,
			duration,
			participants,
			meetingId,
			host: req.user._id,
		});
		await newMeeting.save();
		res.status(201).json({
			message: 'Meeting created successfully',
			meeting: newMeeting,
		});
	} catch (error) {
		console.error('Error creating meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getMeetingById = async (req, res) => {
	try {
		const meeting = await Meeting.findById(req.params.id);
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		res.json({
			meetingId: meeting.meetingId,
			userCount: meeting.users.length,
			maxUsers: meeting.maxUsers,
			users: meeting.users.map((user) => ({
				id: user.userId,
				name: user.name,
				isAudioEnabled: user.isAudioEnabled,
				isVideoEnabled: user.isVideoEnabled,
			})),
		});
	} catch (error) {
		console.error('Error getting meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const joinMeeting = async (req, res) => {
	try {
		const { isAudioEnabled, isVideoEnabled, meetingId } = req.body;

		// Check if the meeting exists
		const meeting = await Meeting.findById(meetingId);
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		// Check if the user is already in the meeting
		const existingMeeting = await Meeting.findOneAndUpdate(
			{ meetingId },
			{
				$addToSet: { participants: req.user._id },
				$addToSet: { users: {userId: req.user._id, isVideoEnabled, isAudioEnabled, name: req.user.name} },
			},
			{ new: true }
		);

		res.status(200).json({
			message: 'User joined the meeting successfully',
			meeting: existingMeeting,
		});
	} catch (error) {
		console.error('Error joining meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const addParticiants = async (req, res) => {
	try {
		const { participants, meetingId } = req.body;
		if (!meetingId) {
			return res.status(400).json({message: 'Meeting Id is required'})
		}

		const uniqueParticipants = [...new Set(participants)];

		// Check if the meeting exists
		const meeting = await Meeting.findById(meetingId);
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		// Check if the user is already in the meeting
		const existingMeeting = await Meeting.findOneAndUpdate(
			{ meetingId },
			{
				$addToSet: { uniqueParticipants },
			},
			{ new: true }
		);

		res.status(200).json({
			message: 'User joined the meeting successfully',
			meeting: existingMeeting,
		});
	} catch (error) {
		console.error('Error joining meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const removeParticipant = async (req, res) => {
	try {
		const { participantId, meetingId } = req.body;
		if (!meetingId) {
			return res.status(400).json({message: 'Meeting Id is required'})
		}

		// Check if the meeting exists
		const meeting = await Meeting.findById(meetingId);
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		// Check if the user is already in the meeting
		const existingMeeting = await Meeting.findOneAndUpdate(
			{ meetingId },
			{
				$pull: { participants: participantId },
			},
			{ new: true }
		);

		res.status(200).json({
			message: 'User joined the meeting successfully',
			meeting: existingMeeting,
		});
	} catch (error) {
		console.error('Error joining meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const leaveMeeting = async (req, res) => {
	try {
		const { meetingId } = req.body;
		if (!meetingId) {
			return res.status(400).json({message: 'Meeting Id is required'})
		}
		const userId  = req.user._id;

		// Check if the meeting exists
		const meeting = await Meeting.findById(meetingId);
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		// Check if the user is already in the meeting
		const existingMeeting = await Meeting.findOneAndUpdate(
			{ meetingId },
			{
				$pull: { participants: userId },
			},
			{ new: true }
		);
		res.status(200).json({
			message: 'User left the meeting successfully',
			meeting: existingMeeting,
		});
	} catch (error) {
		console.error('Error leaving meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const getMeetingByCode = async (req, res) => {
	try {
		const { code  } = req.body;
		if (!code) {
			return res.status(400).json({message: 'Meeting code is required'})
		}

		// Check if the meeting exists
		const meeting = await Meeting.findOne({ meetingId: code });
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		res.status(200).json({ meeting });
	} catch (error) {
		console.error('Error getting meeting by code:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const deleteMeeting = async (req, res) => {
	try {
		const meeting = await Meeting.findByIdAndDelete(req.params.id);
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		res.status(200).json({ message: 'Meeting deleted successfully' });
	} catch (error) {
		console.error('Error deleting meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
