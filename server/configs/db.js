import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true); // Optional: Avoid deprecation warning
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // <-- Increase timeout
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Fail fast if DB connection fails
  }
};

export default connectDB;
