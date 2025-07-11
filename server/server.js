import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkwebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

connectDB()
connectCloudinary();

const app = express();
app.use(cors()); //Enable Cross-origin Resource Sharing

// Middleware
app.use(express.json()); //Parse JSON bodies
app.use(clerkMiddleware())

// API to use Clerk Webhooks
app.use("/api/clerk", clerkwebhooks)

app.get('/',(req, res)=> res.send('API is working!'));
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));