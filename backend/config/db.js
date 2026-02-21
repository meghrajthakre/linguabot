import mongoose from 'mongoose';

// Connects to MongoDB using MONGO_URI and returns the connection
const connectDB = async (mongoUri) => {
    try {
        if (!mongoUri) throw new Error('MONGO_URI not provided');
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

export default connectDB;
