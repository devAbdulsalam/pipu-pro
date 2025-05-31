// config.js - Configuration management
import dotenv from 'dotenv';

dotenv.config();

export const config = {
	// Server configuration
	server: {
		port: process.env.PORT || 3000,
		host: process.env.HOST || 'localhost',
		nodeEnv: process.env.NODE_ENV || 'development',
	},

	// CORS configuration
	cors: {
		origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	},

	// Socket.IO configuration
	socketIO: {
		pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
		pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
		maxHttpBufferSize: parseInt(process.env.SOCKET_MAX_BUFFER_SIZE) || 1e6,
		cors: {
			origin: process.env.CORS_ORIGIN
				? process.env.CORS_ORIGIN.split(',')
				: '*',
			methods: ['GET', 'POST'],
		},
	},

	// Room configuration
	rooms: {
		maxUsers: parseInt(process.env.ROOM_MAX_USERS) || 10,
		maxRooms: parseInt(process.env.MAX_ROOMS) || 1000,
		roomIdleTimeout: parseInt(process.env.ROOM_IDLE_TIMEOUT) || 30 * 60 * 1000, // 30 minutes
		cleanupInterval: parseInt(process.env.CLEANUP_INTERVAL) || 5 * 60 * 1000, // 5 minutes
		allowRecording: process.env.ALLOW_RECORDING === 'true',
		allowScreenShare: process.env.ALLOW_SCREEN_SHARE !== 'false',
	},

	// WebRTC configuration
	webrtc: {
		iceServers: [
			{ urls: 'stun:stun.l.google.com:19302' },
			{ urls: 'stun:stun1.l.google.com:19302' },
			...(process.env.TURN_SERVER_URL
				? [
						{
							urls: process.env.TURN_SERVER_URL,
							username: process.env.TURN_SERVER_USERNAME,
							credential: process.env.TURN_SERVER_CREDENTIAL,
						},
				  ]
				: []),
		],
	},

	// Rate limiting
	rateLimit: {
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
		max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
		message: 'Too many requests from this IP, please try again later.',
	},

	// Security
	security: {
		helmet: {
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					scriptSrc: [
						"'self'",
						"'unsafe-inline'",
						'https://cdnjs.cloudflare.com',
					],
					imgSrc: ["'self'", 'data:', 'https:'],
					connectSrc: ["'self'", 'wss:', 'ws:'],
					fontSrc: ["'self'"],
					objectSrc: ["'none'"],
					mediaSrc: ["'self'"],
					frameSrc: ["'none'"],
				},
			},
		},
	},

	// Logging
	logging: {
		level: process.env.LOG_LEVEL || 'info',
		format: process.env.LOG_FORMAT || 'combined',
	},

	// Redis configuration (if using Redis for scaling)
	redis: {
		enabled: process.env.REDIS_ENABLED === 'true',
		host: process.env.REDIS_HOST || 'localhost',
		port: parseInt(process.env.REDIS_PORT) || 6379,
		password: process.env.REDIS_PASSWORD || null,
		db: parseInt(process.env.REDIS_DB) || 0,
	},
};
