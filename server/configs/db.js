import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true); // Optional
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000, // Increase timeout for slow startup
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
