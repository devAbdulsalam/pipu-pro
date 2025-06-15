import express from 'express';
import http  from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
export const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
		credentials: true,
	},
});


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store active rooms and users
const rooms = new Map();
const users = new Map();

// Generate unique room ID
function generateRoomId() {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Generate unique user ID
function generateUserId() {
	return Math.random().toString(36).substring(2, 15);
}

// API Routes
app.get('/', (req, res) => {
	res.send(`
    <h1>Video Conference Server</h1>
    <p>Server is running on port ${process.env.PORT || 3001}</p>
    <p>Active rooms: ${rooms.size}</p>
    <p>Connected users: ${users.size}</p>
  `);
});

// Create a new room
app.post('/api/rooms', (req, res) => {
	const roomId = generateRoomId();
	rooms.set(roomId, {
		id: roomId,
		users: [],
		createdAt: new Date(),
	});

	console.log(`Created new room: ${roomId}`);
	res.json({ roomId });
});

// Get room info
app.get('/api/rooms/:roomId', (req, res) => {
	const { roomId } = req.params;
	const room = rooms.get(roomId);

	if (!room) {
		return res.status(404).json({ error: 'Room not found' });
	}

	res.json({
		roomId: room.id,
		userCount: room.users.length,
		users: room.users.map((user) => ({
			id: user.id,
			name: user.name,
			isAudioEnabled: user.isAudioEnabled,
			isVideoEnabled: user.isVideoEnabled,
		})),
	});
});

// Socket.IO connection handling
io.on('connection', (socket) => {
	console.log(`User connected: ${socket.id}`);

	// Handle joining a room
	socket.on('join-room', (data) => {
		const { roomId, userInfo } = data;

		// Generate user ID
		const userId = generateUserId();

		// Create room if it doesn't exist
		if (!rooms.has(roomId)) {
			rooms.set(roomId, {
				id: roomId,
				users: [],
				createdAt: new Date(),
			});
			console.log(`Created new room: ${roomId}`);
		}

		const room = rooms.get(roomId);

		// Create user object
		const user = {
			id: userId,
			socketId: socket.id,
			name: userInfo.name || 'Anonymous',
			isAudioEnabled:
				userInfo.isAudioEnabled !== undefined ? userInfo.isAudioEnabled : true,
			isVideoEnabled:
				userInfo.isVideoEnabled !== undefined ? userInfo.isVideoEnabled : true,
			roomId: roomId,
		};

		// Add user to room and global users map
		room.users.push(user);
		users.set(socket.id, user);

		// Join socket room
		socket.join(roomId);

		console.log(`User ${userId} (${user.name}) joined room ${roomId}`);

		// Notify user they joined successfully
		socket.emit('joined-room', {
			roomId: roomId,
			userId: userId,
			users: room.users,
		});

		// Notify other users in the room
		socket.to(roomId).emit('user-joined', {
			userId: userId,
			userInfo: {
				name: user.name,
				isAudioEnabled: user.isAudioEnabled,
				isVideoEnabled: user.isVideoEnabled,
			},
		});
	});

	// Handle WebRTC offer
	socket.on('offer', (data) => {
		const { offer, targetUserId, fromUserId } = data;
		const targetUser = findUserById(targetUserId);

		if (targetUser) {
			io.to(targetUser.socketId).emit('offer', {
				offer: offer,
				fromUserId: fromUserId,
			});
		}
	});

	// Handle WebRTC answer
	socket.on('answer', (data) => {
		const { answer, targetUserId, fromUserId } = data;
		const targetUser = findUserById(targetUserId);

		if (targetUser) {
			io.to(targetUser.socketId).emit('answer', {
				answer: answer,
				fromUserId: fromUserId,
			});
		}
	});

	// Handle ICE candidates
	socket.on('ice-candidate', (data) => {
		const { candidate, targetUserId, fromUserId } = data;
		const targetUser = findUserById(targetUserId);

		if (targetUser) {
			io.to(targetUser.socketId).emit('ice-candidate', {
				candidate: candidate,
				fromUserId: fromUserId,
			});
		}
	});

	// Handle audio toggle
	socket.on('toggle-audio', (data) => {
		const user = users.get(socket.id);
		if (user) {
			user.isAudioEnabled = data.isAudioEnabled;

			// Notify other users in the room
			socket.to(user.roomId).emit('user-audio-toggle', {
				userId: user.id,
				isAudioEnabled: data.isAudioEnabled,
			});
		}
	});

	// Handle video toggle
	socket.on('toggle-video', (data) => {
		const user = users.get(socket.id);
		if (user) {
			user.isVideoEnabled = data.isVideoEnabled;

			// Notify other users in the room
			socket.to(user.roomId).emit('user-video-toggle', {
				userId: user.id,
				isVideoEnabled: data.isVideoEnabled,
			});
		}
	});

	// Handle screen sharing (placeholder for future implementation)
	socket.on('start-screen-share', () => {
		const user = users.get(socket.id);
		if (user) {
			socket.to(user.roomId).emit('screen-share-started', {
				userId: user.id,
			});
		}
	});

	socket.on('stop-screen-share', () => {
		const user = users.get(socket.id);
		if (user) {
			socket.to(user.roomId).emit('screen-share-stopped', {
				userId: user.id,
			});
		}
	});

	// Handle chat messages (for future implementation)
	socket.on('chat-message', (data) => {
		const user = users.get(socket.id);
		if (user) {
			const message = {
				userId: user.id,
				userName: user.name,
				message: data.message,
				timestamp: new Date(),
			};

			// Broadcast message to all users in the room
			io.to(user.roomId).emit('chat-message', message);
		}
	});

	// Handle disconnection
	socket.on('disconnect', () => {
		console.log(`User disconnected: ${socket.id}`);

		const user = users.get(socket.id);
		if (user) {
			const room = rooms.get(user.roomId);
			if (room) {
				// Remove user from room
				room.users = room.users.filter((u) => u.socketId !== socket.id);

				// If room is empty, delete it
				if (room.users.length === 0) {
					rooms.delete(user.roomId);
					console.log(`Deleted empty room: ${user.roomId}`);
				} else {
					// Notify other users that this user left
					socket.to(user.roomId).emit('user-left', {
						userId: user.id,
						userName: user.name,
					});
				}
			}

			// Remove user from global users map
			users.delete(socket.id);
			console.log(`User ${user.id} (${user.name}) left room ${user.roomId}`);
		}
	});

	// Handle explicit leave room
	socket.on('leave-room', () => {
		const user = users.get(socket.id);
		if (user) {
			socket.leave(user.roomId);

			const room = rooms.get(user.roomId);
			if (room) {
				room.users = room.users.filter((u) => u.socketId !== socket.id);

				if (room.users.length === 0) {
					rooms.delete(user.roomId);
					console.log(`Deleted empty room: ${user.roomId}`);
				} else {
					socket.to(user.roomId).emit('user-left', {
						userId: user.id,
						userName: user.name,
					});
				}
			}

			users.delete(socket.id);
			console.log(`User ${user.id} (${user.name}) left room ${user.roomId}`);
		}
	});
});

// Helper function to find user by ID
function findUserById(userId) {
	for (let user of users.values()) {
		if (user.id === userId) {
			return user;
		}
	}
	return null;
}

// Cleanup function to remove empty rooms periodically
setInterval(() => {
	const emptyRooms = [];
	rooms.forEach((room, roomId) => {
		if (room.users.length === 0) {
			emptyRooms.push(roomId);
		}
	});

	emptyRooms.forEach((roomId) => {
		rooms.delete(roomId);
		console.log(`Cleaned up empty room: ${roomId}`);
	});
}, 60000); // Run every minute

// Error handling middleware
app.use((err, req, res, next) => {
	console.error('Error:', err);
	res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
	console.log(`🎥 Video Conference Server is running on port ${PORT}`);
	console.log(`📡 Socket.IO server is ready for connections`);
	console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('Received SIGTERM, shutting down gracefully');
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	console.log('Received SIGINT, shutting down gracefully');
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});
// temiloluwa akinyemi
// improve the nodejs using import modules, then create UserModel, MeetingModel, ChatModel with mongoose as the data base