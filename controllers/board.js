import { format } from 'date-fns';
import  User  from '../models/user.js';
import { Account } from '../models/account.js';
import { Group } from '../models/group.js';
import { Contribution } from './../models/contribution.js';
import  Chat  from '../models/Chat.js';
// import { JoinGroupChat } from './../helpers/chat.js';
// import { joinByCode } from './../helpers/group.js';
import { sendMessage } from '../helpers/message.js';
import { generateRandomCode } from './../helpers/randomCode.js';
import {
	calculatePayoutAmount,
	calculateCycle,
	createContributionCycles,
} from './../helpers/contributionLogic.js';
// import GroupChat from './../../frontend/src/pages/group/GroupChat';

const fetchGroup = async (req, res) => {
	const groupId = req.params.id;
	try {
		const group = await Group.findOne({ chat: groupId });

		if (!group) {
			return res.status(400).json({ message: 'group name already exists' });
		}
		return res.status(200).json(group);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const fetchGroups = async (req, res) => {
	try {
		const group = await Group.find({
			members: { $elemMatch: { $eq: req.user._id } },
		});

		if (!group) {
			return res.status(400).json({ message: 'Group does not exists' });
		}
		return res
			.status(200)
			.json({ group, message: 'Group created successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const createGroup = async (req, res) => {
	const {
		name,
		penalty,
		groupType,
		frequency,
		rotation,
		amount,
		cycle,
		grace_period,
		payoutAmount,
		participants,
	} = req.body;
	const otp = generateRandomCode();
	try {
		// const existedGroup = await Group.findOne({ groupName: name });

		// if (existedGroup) {
		// 	return res.status(400).json({ message: 'group name already exists' });
		// }

		const group = await Group.create({
			groupName: name,
			groupAdmin: req.user,
			groupType,
			groupCode: otp,
			penalty,
			frequency,
			rotationSequence: rotation,
			participants,
			contributoryAmount: amount,
			contributionCycles: cycle,
			totalCycles: calculateCycle(participants, cycle), // participant * cycle
			payoutAmount:
				payoutAmount || calculatePayoutAmount(amount, participants, cycle), // contributionAmount * participant * cycle
			gracePeriod: grace_period,
			members: [req.user],
		});
		if (!group) {
			return res.status(404).json({ message: 'Group not Created' });
		}
		const groupChat = await Chat.create({
			chatName: name,
			isGroupChat: true,
			groupAdmin: req.user,
			participants: [req.user],
		});

		if (!groupChat) {
			return res.status(404).json({ message: 'GroupChat not Created' });
		}
		group.chat = groupChat._id;
		await group.save();
		const contribution = await Contribution.create({
			groupId: group._id,
			contributor: req.user._id,
			contributionDate: Date.now(),
			amount: 0,
			contribution: createContributionCycles(group, amount),
		});
		contribution.save();
		const message = {
			sender: req.user._id,
			chatId: groupChat._id,
			content: `group created`,
			msgType: `noti`,
		};

		const data = await sendMessage(message);
		return res
			.status(200)
			.json({ group, groupChat, message: 'Group created successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const updateGroup = async (req, res) => {
	const { name, members } = req.body;
	try {
		const groupChat = await Chat.findOneAndUpdate({
			chatName: name,
		});
		const group = await Group.findOneAndUpdate({
			chatName: name,
		});
		return res
			.status(200)
			.json({ group, message: 'Group updated successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const addMembers = async (req, res) => {
	try {
		const { groupId, members } = req.body;
		const groupChat = await Chat.findOne({
			_id: groupId,
			isGroupChat: true,
		});

		if (!groupChat) {
			throw new Error('Group chat does not exist');
		}
		const participants = [...new Set([...members, req.user._id.toString()])];
		const existingParticipants = groupChat.participants.map((participant) =>
			participant.toString()
		);
		const uniqueMembers = participants.filter(
			(member) => !existingParticipants.includes(member)
		);
		const joinGroupChat = await Chat.findByIdAndUpdate(
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

		const joinGroup = await Group.findOneAndUpdate(
			{ chat: groupId },
			{
				$push: { members: { $each: uniqueMembers } },
			},
			{
				new: true,
			}
		)
			.populate('members', '-password -isNewUser')
			.populate('groupAdmin', '-password -isNewUser');
		const contributions = uniqueMembers.forEach((member) => {
			Contribution.create({
				groupId: joinGroup._id,
				contributor: member,
				contributionDate: Date.now(),
				amount: 0,
				contribution: createContributionCycles(joinGroup),
			});
		});

		if (!joinGroup) {
			return res.status(404).json('joinGroup Not Found');
		}
		if (!joinGroupChat) {
			return res.status(404).json('joinGroupChat Not Found');
		}
		const message = {
			sender: req.user._id,
			chatId: groupId,
			content: `${req.user.name} added ${uniqueMembers.length} new member's  to the group`,
			msgType: `noti`,
		};

		const data = await sendMessage(message);
		res.json({ joinGroup, groupChat: joinGroupChat, contributions, data });
	} catch (error) {
		res.status(400).send(error);
	}
};

const addMemberByCode = async (req, res) => {
	try {
		const { groupCode } = req.body;
		const userId = req.user._id;
		if (!userId) {
			throw new Error('Userid is required');
		}
		if (!groupCode) {
			throw new Error('Group invite code is required');
		}
		const group = await Group.findOne({
			groupCode,
		});
		const GroupChat = await Chat.findById(group.chat);

		if (!GroupChat || !group) {
			throw new Error('Group does not exist');
		}
		const isMember = GroupChat.participants.includes(req.user._id);

		if (isMember) {
			return res.status(200).json({
				GroupChat,
				group,
				isMember: true,
				message: 'User is already a member of this group',
			});
		}
		const contribution = await Contribution.findOne({
			groupId: group._id,
			contributor: req.user._id,
		});
		if (contribution) {
			console.log('update user contribution');
		} else {
			const contribution = new Contribution({
				groupId: group._id,
				contributor: req.user._id,
				contributionDate: Date.now(),
				amount: 0,
				contribution: createContributionCycles(group),
			});
			await contribution.save();
		}
		const joinGroup = await Chat.findOneAndUpdate(
			{ _id: group.chat },
			{
				$push: { participants: [req.user._id] },
			},
			{
				new: true,
			}
		)
			.populate('participants', '-password -isNewUser')
			.populate('groupAdmin', '-password -isNewUser');

		if (!joinGroup) {
			throw new Error('Error Joining Group');
		}
		const message = {
			sender: req.user._id,
			chatId: GroupChat._id,
			content: `${req.user.name} joined using group code`,
			msgType: `noti`,
		};

		const data = await sendMessage(message);
		return res.status(200).json({ joinGroup, group, message: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const createContribution = async (req, res) => {
	try {
		const { name, members, code } = req.body;
		const group = await Group.findOne({ code });
		return res
			.status(200)
			.json({ group, message: 'Group created successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const fetchContributions = async (req, res) => {
	try {
		const { groupId } = req.body;
		const group = await Group.findOne({ chat: groupId });

		if (!group) {
			return res.status(400).json({ message: 'group does not exists' });
		}
		console.log(group._id);
		const contribution = await Contribution.find({
			groupId: group._id,
		}).populate('contributor', '-password -isNewUser');
		return res.status(200).json(contribution);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const fetchUserContributions = async (req, res) => {
	try {
		const { groupId } = req.body;
		const group = await Group.findOne({ chat: groupId });
		if (!group) {
			return res.status(400).json({ message: 'group does not exists' });
		}
		console.log(group._id);
		const contribution = await Contribution.find({
			groupId: group._id,
			contributor: req.user._id,
		}).populate('contributor', '-password -isNewUser');
		return res.status(200).json(contribution);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export {
	fetchGroups,
	fetchGroup,
	createGroup,
	updateGroup,
	addMembers,
	addMemberByCode,
	fetchContributions,
	fetchUserContributions,
	createContribution,
};
