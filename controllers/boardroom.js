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