import Hotel from '../models/hotel.js';
import {v2 as cloudinary} from 'cloudinary';
import Room from '../models/room.js';

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userId});

        if(!hotel) 
            return res.json({
                success: false,
                message: "No Hotel Found"
            });
        // Upload images to Cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })
        // Wait for all uplaods to complete
        const images = await Promise.all(uploadImages);

        // Create a new room
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({
            success: true,
            message: "Room created successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to get all rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true}).populate({
            path: 'hotel',
            populate:{
                path: 'owner',
                select: 'image'
            }
        }).sort({createdAt: -1})
        res.json({
            success: true,
            rooms
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({owner: req.auth.userId})
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel");
        res.json({
            success: true,
            rooms
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to toggle availability for a room
export const toogleRoomAvability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({
            success: true,
            message: "Room availability Updated",
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
        
    }
}


