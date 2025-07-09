import Hotel from '../models/hotel.js';

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
        
    } catch (error) {
        
    }
}


// API to get all rooms

export const getRooms = async (req, res) => {
    
}

// API to get all rooms for a specific hotel

export const getOwnerRooms = async (req, res) => {
    
}


// API to toggle availability for a room

export const toogleRoomAvability = async (req, res) => {
    
}


