import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'user-avatars',
		allowed_formats: ['jpg', 'jpeg', 'png'],
		transformation: [{ width: 500, height: 500, crop: 'limit' }],
	},
});

export default storage;
