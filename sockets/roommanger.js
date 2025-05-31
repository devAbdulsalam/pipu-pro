// roomManager.js - Separate room management logic
class RoomManager {
	constructor() {
		this.rooms = new Map();
		this.users = new Map();
	}

	createRoom(roomId, options = {}) {
		const room = new Room(roomId, options);
		this.rooms.set(roomId, room);
		return room;
	}

	getRoom(roomId) {
		return this.rooms.get(roomId);
	}

	deleteRoom(roomId) {
		const room = this.rooms.get(roomId);
		if (room) {
			// Cleanup all users in the room
			room.users.forEach((user) => {
				this.users.delete(user.socketId);
			});
			this.rooms.delete(roomId);
			return true;
		}
		return false;
	}

	addUserToRoom(roomId, userId, socketId, userInfo) {
		const room = this.rooms.get(roomId);
		if (!room) {
			throw new Error('Room not found');
		}

		room.addUser(userId, socketId, userInfo);
		this.users.set(socketId, { userId, roomId });
		return room;
	}

	removeUserFromRoom(socketId) {
		const userSession = this.users.get(socketId);
		if (!userSession) {
			return null;
		}

		const { userId, roomId } = userSession;
		const room = this.rooms.get(roomId);

		if (room) {
			const isEmpty = room.removeUser(userId);

			// Auto-delete empty rooms
			if (isEmpty) {
				this.deleteRoom(roomId);
			}

			this.users.delete(socketId);
			return { room, userId, roomId, isEmpty };
		}

		return null;
	}

	getUserSession(socketId) {
		return this.users.get(socketId);
	}

	getRoomStats() {
		return {
			totalRooms: this.rooms.size,
			totalUsers: this.users.size,
			rooms: Array.from(this.rooms.values()).map((room) => ({
				id: room.id,
				userCount: room.users.size,
				maxUsers: room.maxUsers,
				createdAt: room.createdAt,
			})),
		};
	}

	// Cleanup inactive rooms (optional background task)
	cleanupInactiveRooms(maxIdleTime = 30 * 60 * 1000) {
		// 30 minutes
		const now = new Date();
		const roomsToDelete = [];

		this.rooms.forEach((room, roomId) => {
			if (room.users.size === 0 && now - room.lastActivity > maxIdleTime) {
				roomsToDelete.push(roomId);
			}
		});

		roomsToDelete.forEach((roomId) => {
			this.deleteRoom(roomId);
		});

		return roomsToDelete.length;
	}
}

class Room {
	constructor(roomId, options = {}) {
		this.id = roomId;
		this.users = new Map();
		this.createdAt = new Date();
		this.lastActivity = new Date();
		this.maxUsers = options.maxUsers || 10;
		this.isLocked = options.isLocked || false;
		this.password = options.password || null;
		this.settings = {
			allowScreenShare: options.allowScreenShare !== false,
			allowRecording: options.allowRecording || false,
			muteOnJoin: options.muteOnJoin || false,
			...options.settings,
		};
	}

	addUser(userId, socketId, userInfo) {
		if (this.users.size >= this.maxUsers) {
			throw new Error('Room is full');
		}

		if (this.isLocked && !userInfo.password) {
			throw new Error('Room is locked');
		}

		if (this.password && userInfo.password !== this.password) {
			throw new Error('Invalid room password');
		}

		const user = {
			id: userId,
			socketId,
			name: userInfo.name,
			isAudioEnabled: this.settings.muteOnJoin
				? false
				: userInfo.isAudioEnabled || true,
			isVideoEnabled: userInfo.isVideoEnabled || true,
			isScreenSharing: false,
			role: this.users.size === 0 ? 'host' : 'participant', // First user is host
			joinedAt: new Date(),
			lastActivity: new Date(),
		};

		this.users.set(userId, user);
		this.lastActivity = new Date();
		return user;
	}

	removeUser(userId) {
		const removed = this.users.delete(userId);
		if (removed) {
			this.lastActivity = new Date();

			// Transfer host role if host left
			if (removed && this.users.size > 0) {
				const users = Array.from(this.users.values());
				const currentHost = users.find((u) => u.role === 'host');
				if (!currentHost) {
					// Make the first remaining user the host
					users[0].role = 'host';
				}
			}
		}

		return this.users.size === 0; // Return true if room is empty
	}

	getUsers() {
		return Array.from(this.users.values());
	}

	getUserById(userId) {
		return this.users.get(userId);
	}

	getUserBySocketId(socketId) {
		for (let user of this.users.values()) {
			if (user.socketId === socketId) {
				return user;
			}
		}
		return null;
	}

	updateUserMedia(userId, mediaType, isEnabled) {
		const user = this.users.get(userId);
		if (user) {
			if (mediaType === 'audio') {
				user.isAudioEnabled = isEnabled;
			} else if (mediaType === 'video') {
				user.isVideoEnabled = isEnabled;
			} else if (mediaType === 'screen') {
				user.isScreenSharing = isEnabled;
			}
			user.lastActivity = new Date();
			this.lastActivity = new Date();
			return user;
		}
		return null;
	}

	setRoomSettings(settings) {
		this.settings = { ...this.settings, ...settings };
		this.lastActivity = new Date();
	}

	lockRoom(password = null) {
		this.isLocked = true;
		this.password = password;
		this.lastActivity = new Date();
	}

	unlockRoom() {
		this.isLocked = false;
		this.password = null;
		this.lastActivity = new Date();
	}

	getRoomInfo() {
		return {
			id: this.id,
			userCount: this.users.size,
			maxUsers: this.maxUsers,
			isLocked: this.isLocked,
			settings: this.settings,
			createdAt: this.createdAt,
			lastActivity: this.lastActivity,
			users: this.getUsers().map((user) => ({
				id: user.id,
				name: user.name,
				isAudioEnabled: user.isAudioEnabled,
				isVideoEnabled: user.isVideoEnabled,
				isScreenSharing: user.isScreenSharing,
				role: user.role,
				joinedAt: user.joinedAt,
			})),
		};
	}
}

module.exports = { RoomManager, Room };
