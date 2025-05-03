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
		const { title, description, date, time, duration } = req.body;
		const meeting = await Meeting.findByIdAndUpdate(
			req.params.id,
			{ title, description, date, time, duration },
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
		const { title, description, date, time, duration, participants } = req.body;
		const meetingId = generateUniqueCode(8);
		const newMeeting = new Meeting({
			title,
			description,
			date,
			time,
			duration,
			participants,
			meetingId,
			companyId: req.params.companyId,
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
		res.status(200).json(meeting);
	} catch (error) {
		console.error('Error getting meeting:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const joinMeeting = async (req, res) => {
	try {
		const { meetingId } = req.params;
		const { userId } = req.body;

		// Check if the meeting exists
		const meeting = await Meeting.findById(meetingId);
		if (!meeting) {
			return res.status(404).json({ message: 'Meeting not found' });
		}
		// Check if the user is already in the meeting
		const existingMeeting = await Meeting.findOneAndUpdate(
			{ meetingId },
			{
				$addToSet: { participants: userId },
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
		const { meetingId } = req.params;
		const { participants } = req.body;

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
		const { meetingId } = req.params;
		const { participantId } = req.body;

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
		const { meetingId } = req.params;
		const { userId } = req.body;

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
        const { code } = req.params;

        // Check if the meeting exists
        const meeting = await Meeting.findOne({ accessCode: code });
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