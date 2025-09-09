// controllers/collectionController.js
import mongoose from 'mongoose';
import Collection from '../models/Collection.js';
import Tenant from '../models/Tenant.js';
import {
	generatePaymentLink,
	sendNotification,
} from '../utils/notificationService.js';

export const createCollection = async (req, res) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const {
			type,
			title,
			amount,
			dueDate,
			frequency,
			receivingAccount,
			tenants,
		} = req.body;
		const hostId = req.user._id;

		// Generate collection code first
		const collectionCode = `COL-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;

		// Process tenants and create payment links
		const processedTenants = await Promise.all(
			tenants.map(async (tenant) => {
				let tenantRecord = await Tenant.findOne({
					$or: [
						{ phone: tenant.phone?.trim() },
						{ email: tenant.email?.toLowerCase().trim() },
					],
				}).session(session);

				if (!tenantRecord) {
					tenantRecord = new Tenant({
						phone: tenant.phone?.trim(),
						email: tenant.email?.toLowerCase().trim(),
						name: tenant.name?.trim(),
						apartmentUnit: tenant.apartmentUnit?.trim(),
					});
					await tenantRecord.save({ session });
				}

				const uniqueCode = `TEN-${Date.now()}-${Math.random()
					.toString(36)
					.substr(2, 6)}`;
				const paymentLink = await generatePaymentLink(
					collectionCode,
					uniqueCode,
					amount
				);

				return {
					tenantId: tenantRecord._id,
					phone: tenant.phone?.trim(),
					email: tenant.email?.toLowerCase().trim(),
					apartmentUnit: tenant.apartmentUnit?.trim(),
					amountDue: amount,
					paymentLink,
					uniqueCode,
					status: 'pending',
				};
			})
		);

		// Calculate total expected amount
		const totalExpected = processedTenants.reduce(
			(sum, tenant) => sum + tenant.amountDue,
			0
		);

		// Create collection with processed tenants
		const collection = new Collection({
			hostId,
			type,
			title: title.trim(),
			amount,
			dueDate: new Date(dueDate),
			frequency,
			receivingAccount,
			collectionCode,
			tenants: processedTenants,
			totalExpected,
			totalReceived: 0,
			status: 'active',
		});

		await collection.save({ session });

		// Send notifications to tenants (async - don't await)
		// processedTenants.forEach((tenant) => {
		// 	sendNotification(
		// 		tenant.phone,
		// 		tenant.email,
		// 		tenant.paymentLink,
		// 		collection
		// 	).catch((error) => console.error('Notification failed:', error));
		// });

		await session.commitTransaction();
		session.endSession();

		res.status(201).json({
			success: true,
			data: {
				collectionId: collection._id,
				collectionCode: collection.collectionCode,
				title: collection.title,
				totalTenants: collection.tenants.length,
				totalExpected: collection.totalExpected,
				dueDate: collection.dueDate,
			},
			message: 'Collection created successfully',
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();

		console.error('Error creating collection:', error);

		// More specific error messages
		let errorMessage = error.message;
		if (error.name === 'ValidationError') {
			errorMessage = 'Invalid input data. Please check your fields.';
		} else if (error.code === 11000) {
			errorMessage = 'Duplicate collection or tenant data detected.';
		}

		res.status(400).json({
			success: false,
			message: errorMessage,
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

export const getCollectionDashboard = async (req, res) => {
	try {
		const collections = await Collection.find({ hostId: req.user._id })
			.populate('tenants.tenantId')
			.sort({ createdAt: -1 });

		const dashboard = collections.map((collection) => ({
			id: collection._id,
			title: collection.title,
			type: collection.type,
			totalExpected: collection.tenants.reduce(
				(sum, tenant) => sum + tenant.amountDue,
				0
			),
			totalReceived: collection.totalReceived,
			dueDate: collection.dueDate,
			status: collection.status,
			tenants: collection.tenants.map((tenant) => ({
				name: tenant.tenantId?.name || 'Unknown',
				apartmentUnit: tenant.apartmentUnit,
				amountDue: tenant.amountDue,
				status: tenant.status,
			})),
		}));

		res.json({ success: true, data: dashboard });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getCollections = async (req, res) => {
	try {
		const collections = await Collection.find({ hostId: req.user.id })
			.populate('tenants.tenantId')
			.sort({ createdAt: -1 });

		res.json({ success: true, data: collections });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
