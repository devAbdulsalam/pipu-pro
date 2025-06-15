import { app, io } from '../index2.js';
import { v4 as uuidv4 } from 'uuid';
import Meeting from '../models/Meeting.js';

// Socket.IO with MongoDB Integration
io.on('connection', (socket) => {
	console.log('User connected:', socket.id);

	socket.on('join-meeting', async (data) => {
		try {
			const { meetingId, userInfo } = data;
			const userId = uuidv4();

			const meeting = await Meeting.findOne({ meetingId });
			if (!meeting) {
				socket.emit('error', { message: 'Meeting not found' });
				return;
			}

			// Check meeting capacity
			if (meeting.users.length >= meeting.maxUsers) {
				socket.emit('error', { message: 'Meeting is full' });
				return;
			}

			// Add user to meeting
			meeting.users.push({
				userId,
				socketId: socket.id,
				name: userInfo.name,
				isAudioEnabled: userInfo.isAudioEnabled,
				isVideoEnabled: userInfo.isVideoEnabled,
			});

			await meeting.save();

			// Join socket meeting
			socket.join(meetingId);

			// Notify user of successful join
			socket.emit('joined-meeting', {
				userId,
				meetingId,
				users: meeting.users,
			});

			// Notify other users
			socket.to(meetingId).emit('user-joined', {
				userId,
				userInfo: {
					id: userId,
					name: userInfo.name,
					isAudioEnabled: userInfo.isAudioEnabled,
					isVideoEnabled: userInfo.isVideoEnabled,
				},
			});

			console.log(`User ${userId} joined meeting ${meetingId}`);
		} catch (err) {
			socket.emit('error', { message: err.message });
		}
	});

	// WebRTC Signaling handlers remain the same...

	socket.on('disconnect', async () => {
		try {
			const meeting = await Meeting.findOne({ 'users.socketId': socket.id });
			if (!meeting) return;

			const userIndex = meeting.users.findIndex(
				(user) => user.socketId === socket.id
			);
			if (userIndex === -1) return;

			const [disconnectedUser] = meeting.users.splice(userIndex, 1);
			await meeting.save();

			// Notify other users
			socket.to(meeting.meetingId).emit('user-left', {
				userId: disconnectedUser.userId,
			});

			// Delete meeting if empty
			// if (meeting.users.length === 0) {
			// 	await Meeting.deleteOne({ meetingId: meeting.meetingId });
			// 	console.log(`Meeting ${meeting.meetingId} deleted (empty)`);
			// }

			console.log(
				`User ${disconnectedUser.userId} left meeting ${meeting.meetingId}`
			);
		} catch (err) {
			console.error('Disconnection error:', err);
		}
	});
});
