import mongoose from 'mongoose';
import Chat from './../models/Chat.js';
import User from './../models/User.js';
import Group from '../models/Board.js';

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		console.log('UserId param not sent with request');
		return res.status(400).json({
			message: 'UserId param not sent with request',
		});
	}
	try {
		var isChat = await Chat.find({
			isGroupChat: false,
			$and: [
				{ participants: { $elemMatch: { $eq: req.user._id } } },
				{ participants: { $elemMatch: { $eq: userId } } },
			],
		})
			.populate('participants', '-password')
			.populate('latestMessage');

		isChat = await User.populate(isChat, {
			path: 'latestMessage.sender',
			select: 'name pic email',
		});

		if (isChat.length > 0) {
			return res.status(200).json(isChat[0]);
		} else {
			var chatData = {
				chatName: 'sender',
				isGroupChat: false,
				participants: [req.user._id, userId],
			};

			const createdChat = await Chat.create(chatData);
			const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
				'participants',
				'-password'
			);
			res.status(200).json(FullChat);
		}
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = async (req, res) => {
	try {
		Chat.find({
			participants: { $elemMatch: { $eq: req.user._id } },
		})
			.populate('participants', '-password -isNewUser')
			.populate('groupAdmin', '-password -isNewUser')
			.populate('latestMessage')
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: 'latestMessage.sender',
					select: 'name avatar email',
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};
const fetchGroupChats = async (req, res) => {
	try {
		Chat.find({
			isGroupChat: true,
			participants: { $elemMatch: { $eq: req.user._id } },
		})
			.populate('participants', '-password -isNewUser')
			.populate('groupAdmin', '-password -isNewUser')
			.populate('latestMessage')
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: 'latestMessage.sender',
					select: 'name avatar email',
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = async (req, res) => {
	if (!req.body.participants || !req.body.name) {
		return res.status(400).send({ message: 'Please Fill all the feilds' });
	}

	// var allParticipants = JSON.parse(req.body.participants);
	console.log('participants =', req.user._id);
	let members = req.body.participants;
	
	if (!members || members.length === 0) {
		return res.status(400).send('Participants are required to create a group chat');
	}

	// Ensure members is an array
	if (!Array.isArray(members)) {
		return res.status(400).send('Participants must be an array of user IDs');
	}

	const participants = [...new Set([...members, req.user._id.toString()])]; // check for duplicates
	// console.log('participants.length =', participants.length);
	if (participants.length < 2) {
		return res
			.status(400)
			.send('More than 2 participants are required to form a group chat');
	}

	try {
		//validate each participants
		// const users = await User.find({ _id: { $in: participants } });
		// if (users.length !== participants.length) {
		// 	return res.status(400).send('One or more participants do not exist');
		// }

		// check if group already exists
		const groupChat = await Chat.create({
			chatName: req.body.name,
			participants: participants,
			isGroupChat: true,
			groupAdmin: req.user,
		});

		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate('participants', '-password -isNewUser')
			.populate('groupAdmin', '-password -isNewUser');

		res.status(200).json(fullGroupChat);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};

// @desc    Rename Group
// @route   PUT /api/chat/group/rename
// @access  Protected
const renameGroup = async (req, res) => {
	const { chatId, chatName } = req.body;
	// check for chat existence
	try {
		const groupChat = await Chat.findOne({
			_id: new mongoose.Types.ObjectId(chatId),
			isGroupChat: true,
		});

		if (!groupChat) {
			return res.status(400).send('Group chat does not exist');
		}

		// only admin can change the name
		if (groupChat.groupAdmin._id?.toString() !== req.user._id?.toString()) {
			return res.status(400).send('You are not an admin');
		}
		const updatedChat = await Chat.findByIdAndUpdate(
			chatId,
			{
				chatName: chatName,
			},
			{
				new: true,
			}
		)
			.populate('participants', '-password -isNewUser')
			.populate('groupAdmin', '-password -isNewUser');

		if (!updatedChat) {
			res.status(404);
			throw new Error('Chat Not Found');
		} else {
			res.json(updatedChat);
		}
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};

// @desc    Remove user from Group
// @route   PUT /api/chat/group/remove
// @access  Protected
const removeFromGroup = async (req, res) => {
	const { chatId, userId } = req.body;
	try {
		// check if the requester is admin
		// check for chat existence

		const groupChat = await Chat.findOne({
			_id: new mongoose.Types.ObjectId(chatId),
			isGroupChat: true,
		});

		if (!groupChat) {
			return res.status(400).send('Group chat does not exist');
		}

		// only admin can change the name
		if (groupChat.groupAdmin._id?.toString() !== req.user._id?.toString()) {
			return res.status(400).send('You are not an admin');
		}

		const removed = await Chat.findByIdAndUpdate(
			chatId,
			{
				$pull: { participants: userId },
			},
			{
				new: true,
			}
		)
			.populate('participants', '-password -isNewUser')
			.populate('groupAdmin', '-password -isNewUser');

		if (!removed) {
			res.status(404);
			throw new Error('Chat Not Found');
		} else {
			res.json(removed);
		}
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/group/add
// @access  Protected
const addToGroup = async (req, res) => {
	const { groupId, members } = req.body;
	try {
		const groupChat = await Chat.findOne({
			_id: groupId,
			isGroupChat: true,
		});

		if (!groupChat) {
			return res.status(400).send('Group chat does not exist');
		}

		if (groupChat.groupAdmin.toString() !== req.user._id.toString()) {
			return res.status(400).send('You are not an admin');
		}
		const participants = [...new Set([...members, req.user._id.toString()])];
		const existingParticipants = groupChat.participants.map((participant) =>
			participant.toString()
		);
		const uniqueMembers = participants.filter(
			(member) => !existingParticipants.includes(member)
		);

		const updatedChat = await Chat.findByIdAndUpdate(
			groupId,
			{
				$push: { participants: { $each: uniqueMembers } },
			},
			{
				new: true,
			}
		)
			.populate('participants', '-password -isNewUser')
			.populate('groupAdmin', '-password -isNewUser');

		if (!updatedChat) {
			return res.status(404).send('Chat Not Found');
		}

		return res.json(updatedChat);
	} catch (error) {
		console.error('Error adding to group:', error);
		// Handle the error appropriately
		res.status(500).send(error.message);
	}
};

// @desc    Delete user to Group / Leave
// @route   DELETE /api/chat/group
// @access  Protected
const deleteGroup = async (req, res) => {
	const { chatId } = req.params;
	try {
		// check for chat existence
		const groupChat = await Chat.findOne({
			_id: new mongoose.Types.ObjectId(chatId),
			isGroupChat: true,
		});

		if (!groupChat) {
			return res.status(400).json({ message: 'Group chat does not exist' });
		}

		// only admin can change the name
		if (groupChat.groupAdmin._id?.toString() !== req.user._id?.toString()) {
			return res.status(400).json({ message: 'You are not an admin' });
		}

		const deleted = await Chat.findByIdAndDelete(chatId);
		const deletedGroup = await Group.findOneAndDelete({ chat: chatId });

		if (!deleted) {
			res.status(404).json({ message: 'Chat Not Found' });
		} else {
			res.json(deleted, deletedGroup);
		}
	} catch (error) {
		res.status(400).send(error.message);
	}
};

export {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
	fetchGroupChats,
	deleteGroup,
};
