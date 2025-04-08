import express from 'express';
import User from '../models/User.js';
import { upload } from '../middleware/multer.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();


// Create a new user (with optional avatar)
router.post('/', upload.single('avatar'), async (req, res) => {

	try {
		const userData = req.body;

		if (req.file) {
			userData.avatar = req.file.path;
			userData.avatarPublicId = req.file.filename;
		}

		const user = new User(userData);
		await user.save();
		res.status(201).send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// Update user avatar
router.patch('/:id', upload.single('avatar'), async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).send('User not found');
		}

		// Delete old avatar from Cloudinary if exists
		if (user.avatarPublicId) {
			await cloudinary.uploader.destroy(user.avatarPublicId);
		}

		// Update with new avatar
		if (req.file) {
			user.avatar = req.file.path;
			user.avatarPublicId = req.file.filename;
			await user.save();
		}

		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// Delete user avatar
router.delete('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).send('User not found');
		}

		if (user.avatarPublicId) {
			await cloudinary.uploader.destroy(user.avatarPublicId);
			user.avatar = '';
			user.avatarPublicId = '';
			await user.save();
		}

		res.send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

export default router;
