import User from '../models/User.js';
import { hash, verifyHash } from '../utils/hash.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const createToken = (_id, time) => {
	return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: time || '1d',
	});
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
export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: 'Email and password are required fields.' });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password.' });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res
				.status(401)
				.json({ message: 'Email or password is incorrect.' });
		}

		const accessToken = await createToken(user._id, '1d');
		const refreshToken = await createToken(user._id, '7d');
		const newUser = await User.findOne({ _id: user._id }).select('-password');

		const options = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};

		return res
			.status(200)
			.cookie('accessToken', accessToken, options) // set the access token in the cookie
			.cookie('refreshToken', refreshToken, options)
			.json({
				user: newUser,
				accessToken,
				refreshToken,
				statusCode: 200,
				success: true,
				message: 'Logged in successfully.',
			});
	} catch (error) {
		console.error('Error in signinUser:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error.' });
	}
};
export const refreshAccessToken = async (req, res) => {
	const incomingRefreshToken =
		req.cookies.refreshToken || req.body.refreshToken;

	if (!incomingRefreshToken) {
		return res.status(401).json({ error: 'Unauthorized request' });
	}

	try {
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		const user = await User.findById(decodedToken?._id);
		if (!user) {
			return res.status(401).json({ error: 'Invalid refresh token' });
		}

		if (incomingRefreshToken !== user.refreshToken) {
			return res
				.status(401)
				.json({ error: 'Refresh token is expired or used' });
		}

		const options = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};

		const { accessToken, refreshToken: newRefreshToken } = await createTokens(
			user._id
		);

		return res
			.status(200)
			.cookie('accessToken', accessToken, options)
			.cookie('refreshToken', newRefreshToken, options)
			.json({
				accessToken,
				refreshToken: newRefreshToken,
				message: 'Access token refreshed',
			});
	} catch (error) {
		console.error('Refresh token error:', error.message);
		return res
			.status(401)
			.json({ error: error?.message || 'Invalid refresh token' });
	}
};

// // // Forget Password
export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		// Get email from the client and check if user exists
		const user = await User.findOne({ email });

		if (!user) {
			res.status(404).json({
				message: 'Check email and try again',
			});
		}
		// create a token
		const token = createToken(user._id, '5d');
		const link = `${process.env.BASE_URL}/api/v1/users/reset-password/${token}`;

		const mailOption = {
			from: `${process.env.SENDERMAIL}`, // sender address
			to: email, // receivers address
			subject: 'Email for Password Reset', // Subject line
			text: `This Link is valid for 10 Minutes ${link}`, // plain text body
			html: `<p>This Link is valid for 10 Minutes ${link}</p>`,
		};
		const sendMessage = await sendEmail(mailOption);
		if (sendMessage.error) {
			// console.log('error', error);
			return res.status(401).json({ error: error });
		}
		console.log(sendMessage);
		res.status(200).json({
			message: 'Password reset link sent successfully',
		});
	} catch (error) {
		// console.log(error);
		res.status(404).json({ error: error });
	}
};

// Get all users
export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select('-password');
		res.status(200).json(users);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

// Get user by ID
export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user) {
			return res.status(404).send('User not found');
		}
		res.status(200).json(user);
	} catch (err) {
		res.status(500).send(err.message);
	}
};
export const getCurrentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).send('User not found');
		}
		res.status(200).json(user);
	} catch (error) {
		console.error('Error in getCurrentUser:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
export const assignRole = async (req, res) => {
	try {
		const { userId } = req.params;
		const { role } = req.body;
		const user = await User.findById(userId);

		if (!user) {
			res.status(500).json({ error: 'User does not exist' });
		}
		user.role = role;
		await user.save({ validateBeforeSave: false });

		return res.status(200).json({ message: 'Role updated for the user' });
	} catch (error) {
		console.error('Error in assignRole:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};

export const updateAvatar = async (req, res) => {
	try {
		const { id } = req.user;

		console.log('User ID:', id);

		if (!id || !mongoose.isValidObjectId(id)) {
			return res.status(400).json({ error: 'Invalid user ID' });
		}

		if (!req.file) {
			return res.status(400).json({ error: 'Avatar image is required' });
		}

		// Upload to Cloudinary
		const result = await cloudinary.uploader.upload(req.file.path, {
			folder: 'avatars',
			overwrite: true,
			public_id: `user_${id}_avatar`,
		});

		// Format avatar object
		const avatar = {
			url: result.secure_url,
			public_id: result.public_id,
		};

		// Update user avatar
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ avatar },
			{ new: true }
		);

		// Delete local uploaded file
		await fs.promises.unlink(req.file.path);

		if (!updatedUser) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json({
			message: 'Avatar updated successfully',
			user: updatedUser,
		});
	} catch (error) {
		console.error('Avatar upload failed:', error);

		if (req.file) {
			try {
				await fs.promises.unlink(req.file.path);
			} catch (unlinkErr) {
				console.warn('Failed to delete temp file:', unlinkErr);
			}
		}

		res.status(500).json({ error: 'Server error' });
	}
};
export const updateProfile = async (req, res) => {
	try {
		const { name, email } = req.body;
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		user.name = name;
		user.email = email;
		await user.save();
		res.status(200).json({ message: 'Profile updated successfully' });
	} catch (error) {
		console.error('Error in updateProfile:', error);
		res.status(500).json({ error: error.message || 'Internal server error' });
	}
};

// // // reset Password
export const verifyResetToken = async (req, res) => {
	const { token } = req.params;
	try {
		const verify = jwt.verify(token, process.env.SECRET);

		if (!verify) {
			res.status(404).json({ error: 'verification failed' });
		}
		res.status(200).json({
			verified: true,
			token,
			message: 'Reset token verified Successfully',
		});
	} catch (error) {
		res.status(401).json({ error: error.message || 'Something went wrong' });
	}
};
// // // reset Password
export const resetPassword = async (req, res) => {
	const { token } = req.params;
	const { newPassword } = req.params;
	try {
		const verify = jwt.verify(token, process.env.SECRET);

		if (!verify) {
			res.status(404).json({ error: 'verification failed' });
		}
		const user = await User.findById(verify?._id).select('-password');
		const hashPassword = await User.hashpsw(newPassword);
		user.password = hashPassword;
		await user.save();
		res
			.status(200)
			.json({ message: 'Password Reset Successfully', success: true });
	} catch (error) {
		res.status(401).json({ error: error.message || 'Something went wrong' });
	}
};

// // // change logged in user Password
export const changePassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	try {
		const user = await User.findById(req.user?._id);
		const isPasswordValid = await user.checkPassword(oldPassword);
		if (!isPasswordValid) {
			res.status(400).json({ message: 'Invalid old password' });
		}
		const hashPassword = await user.hashpsw(newPassword);
		user.password = hashPassword;
		await user.save();
		res.status(200).json({ message: 'Password Changed Successfully' });
	} catch (error) {
		console.error('Error in changePassword:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Something went wrong' });
	}
};

export const logOutUser = async (req, res) => {
	try {
		await User.findByIdAndUpdate(
			req.user._id,
			{
				$set: {
					refreshToken: undefined,
				},
			},
			{ new: true }
		);

		const options = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		// res.status(200).
		return res
			.status(200)
			.clearCookie('accessToken', options)
			.clearCookie('refreshToken', options)
			.json({ message: 'Logged out successfully' });
	} catch (error) {
		console.error('Error in logOutUser:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const deleteUser = async (req, res) => {
	const { id } = req.body;
	try {
		// required other validation i.e dont delete user with
		let user = await User.findByIdAndDelete({ _id: id });
		if (!user) {
			res.status(401).json({ status: 401, message: 'user not exist' });
		}
		user = await user.save();
		res.status(200).json({ message: 'Account Deleted Successfully' });
	} catch (error) {
		console.error('Error in assignRole:', error);
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error' });
	}
};
