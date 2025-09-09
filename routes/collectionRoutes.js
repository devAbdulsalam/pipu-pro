// routes/collectionRoutes.js
import express from 'express';
import {
	createCollection,
	getCollections,
	getCollectionDashboard,
} from '../controllers/collection.js';
import { requireAuth, verifyPermission } from '../middleware/requireAuth.js';
import { validateCollection } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateCollection, requireAuth, createCollection);
router.get('/dashboard', requireAuth, getCollectionDashboard);
router.get('/', requireAuth, getCollections);

export default router;
// This file defines routes for managing collections, including creating collections and retrieving dashboard data.
