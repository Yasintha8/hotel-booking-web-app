import { useAppContext } from '../context/AppContext';
import HotelCard from './HotelCard'
import Tittle from './Tittle'

const FeaturedDestination = () => {

    const {rooms, navigate} = useAppContext();

  return rooms.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

        <Tittle title={"Featured Destination"} subTitle={"Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences"} align={"center"} />

        <div className='flex flex-wrap items-center justify-center gap-6 mt-20 '>
            {rooms.slice(0,4).map((room, index)=>(
                <HotelCard key={room._id} room={room} index={index} />
            ))}
        </div>
        <button onClick={()=>
            {
                navigate('/rooms');scrollTo(0,0);
            }
        } className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
            View all Destinations
        </button>
    </div>
  )
}

export default FeaturedDestination