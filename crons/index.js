// crons/index.js
import cron from 'node-cron';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import checkSubscriptions from './checkSubscription.js';
import remindExpiring from './remindExpiring.js';
import generateReports from './generateReports.js';
import scheduleSubscriptionExpiryJob from './scheduleSubscriptionExpiryJob.js';

dotenv.config();

// Ensure MongoDB connection for standalone or long-running cron environment
if (mongoose.connection.readyState === 0) {
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('[CRON] Connected to MongoDB');
		})
		.catch((err) => {
			console.error('[CRON] MongoDB connection failed:', err.message);
		});
}

// Daily at 12:20 AM: Expire subscriptions

cron.schedule('20 0 * * *', async () => {
	console.log('[CRON] Running subscription expiration check...');
	scheduleSubscriptionExpiryJob();
});
// Daily at 12:01 AM: Expire subscriptions
cron.schedule('1 0 * * *', () => {
	console.log('[CRON] Running subscription expiration check...');
	checkSubscriptions();
});

// Daily at 8:00 PM: Remind expiring subscriptions
cron.schedule('0 20 * * *', () => {
	console.log('[CRON] Running expiring subscription reminder...');
	remindExpiring();
});

// Daily at 2:45 PM: Generate reports
cron.schedule('22 15 * * *', () => {
// cron.schedule('45 14 * * *', () => {
	console.log('[CRON] Running daily report generation...');
	generateReports();
});


// | Field       | Value | Meaning                    |
// | ----------- | ----- | -------------------------- |
// | **Minute**  | `0`   | At minute **0**            |
// | **Hour**    | `20`  | At **20:00 (8 PM)**        |
// | **Day**     | `*`   | Every day of the **month** |
// | **Month**   | `*`   | Every **month**            |
// | **Weekday** | `*`   | Every **day of the week**  |

// ┌───────────── minute (0 - 59)
// │ ┌───────────── hour (0 - 23)
// │ │ ┌───────────── day of month (1 - 31)
// │ │ │ ┌───────────── month (1 - 12)
// │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
// │ │ │ │ │
// │ │ │ │ │
// * * * * *  command to run

// * * * * * → every minute

// 0 * * * * → every hour on the hour

// 0 0 * * * → every day at midnight

// 30 9 * * 1-5 → at 9:30 AM Monday to Friday