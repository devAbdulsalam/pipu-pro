// utils/paymentProcessor.js
import axios from 'axios';

// Payment Gateway Configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const BASE_URL = process.env.BASE_URL;

/**
 * Initialize payment with Paystack
 */
export const initializePaystackPayment = async (
	email,
	amount,
	metadata,
	callbackUrl = null
) => {
	try {
		const response = await axios.post(
			'https://api.paystack.co/transaction/initialize',
			{
				email,
				amount: Math.round(amount * 100), // Convert to kobo
				metadata,
				callback_url: callbackUrl || `${BASE_URL}/payments/verify`,
				channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
			},
			{
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		return {
			success: true,
			data: response.data.data,
			gateway: 'paystack',
		};
	} catch (error) {
		console.error(
			'Paystack initialization error:',
			error.response?.data || error.message
		);
		return {
			success: false,
			error: error.response?.data?.message || 'Payment initialization failed',
		};
	}
};

/**
 * Initialize payment with Flutterwave
 */
export const initializeFlutterwavePayment = async (
	email,
	amount,
	metadata,
	redirectUrl = null
) => {
	try {
		const response = await axios.post(
			'https://api.flutterwave.com/v3/payments',
			{
				tx_ref: `PIPU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				amount: amount,
				currency: 'NGN',
				redirect_url: redirectUrl || `${BASE_URL}/payments/verify`,
				customer: {
					email: email,
					phonenumber: metadata.phone || '',
					name: metadata.name || '',
				},
				customizations: {
					title: 'PipuPro Collections',
					description: metadata.description || 'Payment for services',
					logo: `${BASE_URL}/logo.png`,
				},
				meta: metadata,
			},
			{
				headers: {
					Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		return {
			success: true,
			data: response.data.data,
			gateway: 'flutterwave',
		};
	} catch (error) {
		console.error(
			'Flutterwave initialization error:',
			error.response?.data || error.message
		);
		return {
			success: false,
			error: error.response?.data?.message || 'Payment initialization failed',
		};
	}
};

/**
 * Verify Paystack payment
 */
export const verifyPaystackPayment = async (reference) => {
	try {
		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${reference}`,
			{
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
				},
			}
		);

		const { data } = response.data;

		return {
			success: data.status === 'success',
			data: {
				reference: data.reference,
				amount: data.amount / 100, // Convert from kobo to naira
				currency: data.currency,
				status: data.status,
				gateway: 'paystack',
				metadata: data.metadata,
				paidAt: data.paid_at,
				customer: {
					email: data.customer.email,
					phone: data.customer.phone,
				},
			},
		};
	} catch (error) {
		console.error(
			'Paystack verification error:',
			error.response?.data || error.message
		);
		return {
			success: false,
			error: error.response?.data?.message || 'Payment verification failed',
		};
	}
};

/**
 * Verify Flutterwave payment
 */
export const verifyFlutterwavePayment = async (transactionId) => {
	try {
		const response = await axios.get(
			`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
			{
				headers: {
					Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
				},
			}
		);

		const { data } = response.data;

		return {
			success: data.status === 'successful',
			data: {
				reference: data.tx_ref,
				transactionId: data.id,
				amount: data.amount,
				currency: data.currency,
				status: data.status,
				gateway: 'flutterwave',
				metadata: data.meta,
				paidAt: data.created_at,
				customer: {
					email: data.customer.email,
					phone: data.customer.phone_number,
				},
			},
		};
	} catch (error) {
		console.error(
			'Flutterwave verification error:',
			error.response?.data || error.message
		);
		return {
			success: false,
			error: error.response?.data?.message || 'Payment verification failed',
		};
	}
};

/**
 * Process payment (main function)
 */
export const processPayment = async (paymentData) => {
	const {
		email,
		amount,
		metadata,
		gateway = 'paystack', // Default to Paystack
		callbackUrl = null,
	} = paymentData;

	try {
		let result;

		switch (gateway.toLowerCase()) {
			case 'paystack':
				result = await initializePaystackPayment(
					email,
					amount,
					metadata,
					callbackUrl
				);
				break;

			case 'flutterwave':
				result = await initializeFlutterwavePayment(
					email,
					amount,
					metadata,
					callbackUrl
				);
				break;

			default:
				throw new Error(`Unsupported payment gateway: ${gateway}`);
		}

		if (!result.success) {
			throw new Error(result.error);
		}

		return {
			success: true,
			paymentUrl: result.data.link || result.data.authorization_url,
			reference: result.data.reference || result.data.tx_ref,
			gateway: result.gateway,
			metadata: result.data,
		};
	} catch (error) {
		console.error('Payment processing error:', error);
		return {
			success: false,
			error: error.message,
			gateway,
		};
	}
};

/**
 * Handle payment webhook
 */
export const handlePaymentWebhook = async (payload, gateway) => {
	try {
		let verificationResult;

		switch (gateway) {
			case 'paystack':
				if (payload.event === 'charge.success') {
					verificationResult = await verifyPaystackPayment(
						payload.data.reference
					);
				}
				break;

			case 'flutterwave':
				if (
					payload.event === 'charge.completed' &&
					payload.data.status === 'successful'
				) {
					verificationResult = await verifyFlutterwavePayment(payload.data.id);
				}
				break;

			default:
				throw new Error(`Unsupported gateway for webhook: ${gateway}`);
		}

		if (verificationResult && verificationResult.success) {
			return {
				success: true,
				data: verificationResult.data,
				gateway,
			};
		}

		return {
			success: false,
			error: 'Webhook verification failed',
			gateway,
		};
	} catch (error) {
		console.error('Webhook processing error:', error);
		return {
			success: false,
			error: error.message,
			gateway,
		};
	}
};

/**
 * Refund payment
 */
export const refundPayment = async (
	reference,
	amount,
	gateway = 'paystack'
) => {
	try {
		let url, body;

		switch (gateway) {
			case 'paystack':
				url = 'https://api.paystack.co/refund';
				body = {
					transaction: reference,
					amount: amount ? Math.round(amount * 100) : undefined,
				};
				break;

			case 'flutterwave':
				url = 'https://api.flutterwave.com/v3/refunds';
				body = {
					transaction_id: reference,
					amount: amount,
				};
				break;

			default:
				throw new Error(`Unsupported gateway for refund: ${gateway}`);
		}

		const response = await axios.post(url, body, {
			headers: {
				Authorization: `Bearer ${
					gateway === 'paystack' ? PAYSTACK_SECRET_KEY : FLUTTERWAVE_SECRET_KEY
				}`,
				'Content-Type': 'application/json',
			},
		});

		return {
			success: true,
			data: response.data.data,
			gateway,
		};
	} catch (error) {
		console.error('Refund error:', error.response?.data || error.message);
		return {
			success: false,
			error: error.response?.data?.message || 'Refund failed',
			gateway,
		};
	}
};

/**
 * Get payment gateway status
 */
export const getPaymentGatewayStatus = async (gateway = 'paystack') => {
	try {
		let url;

		switch (gateway) {
			case 'paystack':
				url = 'https://api.paystack.co/balance';
				break;

			case 'flutterwave':
				url = 'https://api.flutterwave.com/v3/balances/NGN';
				break;

			default:
				throw new Error(`Unsupported gateway: ${gateway}`);
		}

		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${
					gateway === 'paystack' ? PAYSTACK_SECRET_KEY : FLUTTERWAVE_SECRET_KEY
				}`,
			},
		});

		return {
			success: true,
			data: response.data.data || response.data,
			gateway,
		};
	} catch (error) {
		console.error(
			'Gateway status error:',
			error.response?.data || error.message
		);
		return {
			success: false,
			error: error.response?.data?.message || 'Gateway status check failed',
			gateway,
		};
	}
};

export default {
	processPayment,
	verifyPaystackPayment,
	verifyFlutterwavePayment,
	handlePaymentWebhook,
	refundPayment,
	getPaymentGatewayStatus,
};
