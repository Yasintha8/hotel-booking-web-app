import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkwebhooks from './controllers/clerkWebhooks.js';

import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

// Connect database and cloudinary
connectDB();
connectCloudinary();

// Allow Clerk to verify webhook body (must come BEFORE express.json)
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkwebhooks);

// Enable JSON for other routes
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware()); // Protect routes if needed

// Main API routes
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

app.get('/', (req, res) => {
  res.send('API is working!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
