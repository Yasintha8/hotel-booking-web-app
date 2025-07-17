import transporter from "../configs/nodemailer.js";
import Booking from "../models/booking.js"
import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import Stripe from "stripe";

// Function to check Availability of Rooms
const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
    try {
     const bookings = await Booking.find({
        room,
        checkInDate: {$lte: checkOutDate},
        checkOutDate: {$gte: checkInDate},
     });
        const isAvailable = bookings.length === 0; // If no bookings found, room is available
        return isAvailable;

    } catch (error) {
        console.error(error.message);
    }
}

// API to check availability of rooms
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
        res.json({
            success: true,
            isAvailable
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

// API to create a new booking
// POST /api/bookings/book

export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests} = req.body;
        const user = req.user._id; // Assuming user ID is available in req.user

        // Before booking, check if the room is available
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });
        if (!isAvailable) {
            return res.json({
                success: false,
                message: "Room is not available for the selected dates."
            });
        }

        // GET totalPrice from the Room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        // Calculate total price based nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

        totalPrice *= nights; // Total price based on nights

        // Create a new booking
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Hotel Booking Details',
            html: `
                <h2>Your Booking Details</h2>
                <p>Dear ${req.user.username},</p>
                <p>Thank you for booking with us. Here are the details of your booking:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                    <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                    <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || 'LKR'} ${booking.totalPrice} /night</li>
                </ul>
                <p>We look forward to welcoming you at ${roomData.hotel.name}.</p>
                <p>If you need to make any changes, feel free to contact us.</p>
            `
        }
        await transporter.sendMail(mailOptions)

        res.json({
            success: true,
            message: "Booking created successfully",
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Failed to create booking",
        });
        
    }
}

// API to get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id; // Assuming user ID is available in req.user
        const bookings = await Booking.find({user})
            .populate("room hotel")
            .sort({ createdAt: -1 }); // Sort by most recent bookings

        res.json({
            success: true,
            bookings,
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Failed to fetch user bookings",
        });
        
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({owner: req.auth.userId});
        if (!hotel) {
            return res.json({
                success: false,
                message: "No Hotel found",
            });
        }
        const bookings = await Booking.find({hotel: hotel._id})
            .populate("room hotel user")
            .sort({ createdAt: -1 }); // Sort by most recent bookings

            // Total Bookings
        const totalBookings = bookings.length;
            // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({
            success: true,
            dashboardData: {
                totalBookings,
                totalRevenue,
                bookings
            }
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Failed to fetch hotel bookings",
        });
        
    }
}

export const stripePayment = async (req, res) => {
    try {
        const {bookingId} = req.body;

        const booking = await Booking.findById(bookingId);
        const roomData = await Room.findById(booking.room).populate("hotel");
        const totalPrice = booking.totalPrice;
        const {origin} = req.headers;

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [
            {
                price_data: {
                    currency: "lkr",
                    product_data: {
                        name: roomData.hotel.name,
                    },
                    unit_amount: totalPrice * 100
                },
                quantity: 1,
            }
        ]
        // Create Checkout Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata: {
                bookingId,
            }
        })
        res.json({
            success: true,
            url: session.url
        })

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Payment Failed",
        });
    }
}