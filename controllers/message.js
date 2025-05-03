import Chat from './../models/Chat.js';
import User from './../models/User.js';
import ChatMessage from './../models/ChatMessage.js';

//@description     Get all Messages
//@route           GET /api/message/:chatId
//@access          Protected
const allMessages = async (req, res) => {
	try {
		const messages = await ChatMessage.find({ chat: req.params.chatId })
			.populate('sender', 'name avatar email')
			.populate('chat');
		res.status(200).json(messages);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async (req, res) => {
	const { content, chatId, msgType } = req.body;

	if (!content || !chatId) {
		// console.log('Invalid data passed into request');
		return res.status(400).json({ error: 'Invalid data passed into request' });
	}

	var newMessage = {
		sender: req.user._id,
		content: content,
		chat: chatId,
		msgType,
	};

	try {
		var message = await ChatMessage.create(newMessage);
		message = await message.populate('sender', 'name avatar');
		message = await message.populate('chat');
		message = await User.populate(message, {
			path: 'chat.participants',
			select: 'name avatar email',
		});

		await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

		res.status(200).json(message);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export { allMessages, sendMessage };
// https://github.com/devAbdulsalam/Kudinkaapp.git
