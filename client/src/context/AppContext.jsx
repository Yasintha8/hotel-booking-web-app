import axios from 'axios';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || 'LKR';
  const navigate  = useNavigate();
  const { user }  = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(
    () => JSON.parse(localStorage.getItem('isOwner')) || false
  );

  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      
    }
  }

  const updateIsOwner = useCallback(value => {
    setIsOwner(value);
    localStorage.setItem('isOwner', JSON.stringify(value));
  }, []);

  const fetchUser = useCallback(async () => {
    if (!user) {
      updateIsOwner(false);      
      return;
    }
    try {
      const { data } = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        updateIsOwner(data.role === 'hotelOwner');
        setSearchedCities(data.recentSearchedCities);
      } else {
        setTimeout(fetchUser, 5000);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, [user, getToken, updateIsOwner]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    updateIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms, 
    setRooms
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
