import User from '../models/User.js';
import { hash, verifyHash } from '../utils/hash.js';

const createToken = (_id, time) => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: time || '1d' });
};
export const signinUser = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const existingUser = await User.findOne({ email });

		// To handle the 409 status code, typically indicating a conflict, you might want to implement it in scenarios where there's a conflict with the current state of the resource.
		// For example, if you're trying to create a new user with an email or username that already exists, it would result in a conflict.
		if (existingUser) {
			return res.status(409).json({ error: 'Email Address already Exists' });
		}

		const hashedPassword = await hash(password);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});
		// Remove password from the response
		user.password = undefined;

		res.status(200).json({
			user,
			statusCode: 200,
			success: true,
			message: 'Account created successfully, Login to continue',
		});
	} catch (error) {
		console.error('Error in signinUser:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};
