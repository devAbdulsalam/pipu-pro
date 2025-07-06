import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import pipuproRoutes from './routes/pipuproRoutes.js';
import companyRoutes from './routes/company/index.js';
import staffRoutes from './routes/staffRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import boardRoomRoutes from './routes/staffRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import generalRoutes from './routes/generalRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import  './crons/index.js';

// setups
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = fs.readFileSync(path.resolve(__dirname, './swagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);

dotenv.config();
export const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});
const PORT = process.env.PORT || 5000;
// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	validate: { xForwardedForHeader: false },
	handler: (_, __, ___, options) => {
		throw new Error(
			options.statusCode || 500,
			`There are too many requests. You are only allowed ${
				options.max
			} requests per ${options.windowMs / 60000} minutes`
		);
	},
});
app.use((req, res, next) => {
	res.setHeader('Origin-Agent-Cluster', '?1');
	next();
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public')); // configure static file to save images locally
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors('*'));

// required for passport
app.use(
	session({
		secret: process.env.EXPRESS_SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
); // session secret

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();
// REST API Routes
app.get('/api/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		dbStatus:
			mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
	});
});
// Routes
app.use('/api/v1/admin', pipuproRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/guest', guestRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/meetings', meetingRoutes);
app.use('/api/v1/pages', contentRoutes);
app.use('/api/v1/board-rooms', boardRoomRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1', generalRoutes);

console.log(typeof require); // console.log("5" + 3 - 2); // This will log "53" because of string concatenation

// Basic route
// * API DOCS
// ? Keeping swagger code at the end so that we can load swagger on "/" route
app.use(
	'/',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, {
		swaggerOptions: {
			docExpansion: 'all', // keep all the sections collapsed by default none/all
		},
		customSiteTitle: `${process.env.PROJECT_NAME || 'backend'} api docs`,
	})
);

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
const shutdown = async () => {
	console.log('Shutting down gracefully...');
	await mongoose.connection.close();
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
