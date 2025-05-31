import { app, io } from '../index.js';
import { v4 as uuidv4 } from 'uuid';
import Chat from '../models/Chat.js';
import ChatMessage from '../models/ChatMessage.js';


io.on('connection', (socket) => {
	console.log('socket is active to be connected');
	socket.on('setup', (userData) => {
		socket.join(userData._id);
		io.emit('connected');
	});
	socket.on('join chat', (room) => {
		socket.join(room);
		console.log('user joind room: "' + room);
	});
	socket.on('new message', (newMessageReceived) => {
		var chat = newMessageReceived.chat;
		if (!chat.participants) return console.log('chat.participants not defined');
		chat.participants.forEach((user) => {
			if (user._id === newMessageReceived.sender._id) return;
			socket.in(user._id).emit('message received', newMessageReceived);
		});
	});
	socket.on('typing', (room) => socket.in(room).emit('typing'));
	socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
	socket.off('setup', () => {
		console.log('USER DISCONNECTED');
		socket.leave(userData._id);
	});
});
