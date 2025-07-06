import Notification from '../models/Notification.js';
import NotificationSetting from '../models/NotificationSetting.js';
import Announcement from '../models/Announcement.js';
import User from '../models/User.js';

// Send a Announcement
export const sendAnnouncement = async (req, res) => {
	const { recipientId, message, type } = req.body;

	try {
		const user = await User.findById(recipientId);

		if (!user) {
			return res.status(404).json({ message: 'Recipient not found' });
		}

		const announcement = await Announcement.create({
			recipient: recipientId,
			message,
			type,
			read: false,
		});

		res
			.status(201)
			.json({ message: 'Announcement sent successfully', announcement });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Failed to send announcement', error: error.message });
	}
};

export const getNotificationSettings = async (req, res) => {
	const userId = req.user._id;

	try {
		const notificationSettings = await NotificationSetting.find({
			userId,
		}).sort({
			createdAt: -1,
		});

		res.status(200).json(notificationSettings);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to retrieve notificationSettings',
			error: error.message,
		});
	}
};
export const updateNotificationSettings = async (req, res) => {
	const userId = req.user._id;

	try {
		const notificationSettings = await NotificationSetting.findByIdAndDelete(
			{
				userId,
			},
			{ ...req.body },
			{ new: true }
		);

		res.status(200).json(notificationSettings);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to update notificationSettings',
			error: error.message,
		});
	}
};
export const getAnnouncements = async (req, res) => {
	const userId = req.user._id;

	try {
		const announcements = await Announcement.find({ userId }).sort({
			createdAt: -1,
		});

		res.status(200).json(announcements);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to retrieve announcements',
			error: error.message,
		});
	}
};
export const getAnnouncement = async (req, res) => {
	try {
		const announcement = await Announcement.findById(req.params.id).populate(
			'from',
			'name email profileImage'
		);
		if (!announcement) {
			return res.status(404).json({ message: 'Announcement not found' });
		}

		res.status(200).json(announcement);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to retrieve announcement',
			error: error.message,
		});
	}
};

// Send a notification
export const sendNotification = async (req, res) => {
	const { recipientId, message, type } = req.body;

	try {
		const user = await User.findById(recipientId);

		if (!user) {
			return res.status(404).json({ message: 'Recipient not found' });
		}

		const notification = await Notification.create({
			recipient: recipientId,
			message,
			type,
			read: false,
		});

		res
			.status(201)
			.json({ message: 'Notification sent successfully', notification });
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Failed to send notification', error: error.message });
	}
};

// Get notifications for a user
export const getNotifications = async (req, res) => {
	const userId = req.user._id;

	try {
		const notifications = await Notification.find({ userId }).sort({
			createdAt: -1,
		});
		const announcements = await Announcement.find({ userId }).sort({
			createdAt: -1,
		});

		res.status(200).json({ notifications, announcements });
	} catch (error) {
		res.status(500).json({
			message: 'Failed to retrieve notifications',
			error: error.message,
		});
	}
};
export const getNotification = async (req, res) => {
	try {
		const notification = await Notification.findById(req.params.id).populate(
			'from',
			'name email profileImage'
		);
		if (!notification) {
			return res.status(404).json({ message: 'Notification not found' });
		}

		res.status(200).json(notification);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to retrieve notification',
			error: error.message,
		});
	}
};

// Mark notification as read
export const markAsRead = async (req, res) => {
	const { notificationId, type } = req.body;

	try {
		if (type === 'announcement') {
			const announcement = await Announcement.findById(notificationId);
			if (!announcement) {
				return res.status(404).json({ message: 'Announcement not found' });
			}
			announcement.read = true;
			await announcement.save();
			return res
				.status(200)
				.json({ message: 'Announcement marked as read', announcement });
		}
		const notification = await Notification.findById(notificationId);

		if (!notification) {
			return res.status(404).json({ message: 'Notification not found' });
		}

		notification.read = true;
		await notification.save();

		res
			.status(200)
			.json({ message: 'Notification marked as read', notification });
	} catch (error) {
		res.status(500).json({
			message: 'Failed to mark notification as read',
			error: error.message,
		});
	}
};
