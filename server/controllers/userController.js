//Get /api/user/
export const getUserData = async () =>{
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({
            success: true,
            role,
            recentSearchedCities
        })
    } catch (error){
        res.json({
            success: false,
            message: error.message
        });
    }
}

// Store User Recent Searched Cities
export const storeRecentSearchedCities = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}