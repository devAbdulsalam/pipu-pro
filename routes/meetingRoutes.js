import express from 'express';
import {
	getMeetings,
	getMyMeetings,
	updateMeeting,
	createMeeting,
	getMeetingByCode,
	getMeetingById,
	joinMeeting,
	leaveMeeting,
    addParticiants,
    removeParticipant,
} from '../controllers/meeting.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', getMeetings);
router.post('/', requireAuth, createMeeting);
router.get('/my-meetings', requireAuth, getMyMeetings);
router.get('/:id', requireAuth, getMeetingById);
router.get('/code/:code', getMeetingByCode);
router.put('/:id', requireAuth, updateMeeting);        
router.post('/:id/join', requireAuth, joinMeeting);
router.post('/:id/leave', requireAuth, leaveMeeting);
router.post('/:id/add-participant', requireAuth, addParticiants);
router.post('/:id/remove-participant', requireAuth, removeParticipant);

export default router;