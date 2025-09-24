const mongoose = require('mongoose');

async function connectDB() {
	const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobsdb';
	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 10000,
		});
		console.log(`MongoDB connected: ${mongoose.connection.host}`);
	} catch (error) {
		console.error('MongoDB connection error:', error.message);
		process.exit(1);
	}
}

module.exports = connectDB;
