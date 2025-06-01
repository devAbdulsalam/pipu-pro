import express from 'express';
import {
	getMeetings,
	getMeeting,
	getMyMeetings,
	updateMeeting,
	createMeeting,
	getMeetingByCode,
	getMeetingById,
	joinMeeting,
	leaveMeeting,
    addParticiants,
    removeParticipant,
	deleteMeeting,
} from '../controllers/meeting.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', getMeetings);
router.post('/', requireAuth, createMeeting);
router.get('/my-meetings', requireAuth, getMyMeetings);
router.get('/meetings', requireAuth, getMeeting);
router.get('/code', getMeetingByCode);
router.get('/:id', requireAuth, getMeetingById);
router.patch('/:id', requireAuth, updateMeeting);        
router.post('/join', requireAuth, joinMeeting);
router.post('/leave', requireAuth, leaveMeeting);
router.post('/add-participant', requireAuth, addParticiants);
router.post('/remove-participant', requireAuth, removeParticipant);
router.delete('/:id', requireAuth, deleteMeeting);

export default router;