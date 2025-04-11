import express from 'express';
import {
	signinUser,
	loginUser,
	getAllUsers,
	getUserById,
	assignRole,
	updateProfile,
	logOutUser,
	refreshAccessToken,
	forgotPassword,
	resetPassword,
	getCurrentUser,
	deleteUser,
	updateAvatar,
} from '../controllers/user.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// //new user
router.get('/', getAllUsers);
router.get('/current-user', requireAuth, getCurrentUser);
router.get('/:id', getUserById);
router.post('/register', signinUser);
router.post('/login', loginUser);
router.post('/logout', requireAuth, logOutUser);
router.post('/refresh-token', requireAuth, refreshAccessToken);
router.post(
	'/assign-role/:userId',
	requireAuth,
	verifyPermission(['ADMIN']),
	assignRole
);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// router.post('/verify-email', verifyEmail);
// router.post('/verify-otp', verifyOtp);
router.patch('/avatar', requireAuth, upload.single('avatar'), updateAvatar);
router.patch('/profile', requireAuth, upload.single('avatar'), updateProfile);
router.delete('/delete-account', requireAuth, requireAuth, deleteUser);

export default router;
