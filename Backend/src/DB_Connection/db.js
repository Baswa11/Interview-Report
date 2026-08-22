const mongoose = require('mongoose');
const dns = require('dns');

async function connectDB() {
    const uri = (process.env.MONGODB_URI || '').trim();
    if (!uri) {
        console.error('MONGODB_URI is not set in environment variables');
        return;
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.warn('Initial MongoDB connection attempt error:', error.message);
        // Fallback: try setting public DNS if SRV resolution failed
        try {
            dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 8000
            });
            console.log('Connected to MongoDB with DNS fallback');
        } catch (fallbackError) {
            console.error('MongoDB connection failed after fallback:', fallbackError.message);
        }
    }
}

module.exports = connectDB;