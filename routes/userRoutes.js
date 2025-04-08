import express from 'express';
import User from '../models/User.js';
import { signinUser } from '../controllers/user.js';
import avatarRoutes from './avatarRoutes.js';

const router = express.Router();

// //new user
router.post('/register', signinUser);
router.use('/avatar', avatarRoutes);

// Create a new user
router.post('/', async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).send(user);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// Get all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find();
		res.send(users);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

// Get user by ID
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).send('User not found');
		}
		res.send(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
});

export default router;
