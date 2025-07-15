import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const CARD_HEIGHT = 'h-[22rem]';          // total card height
const IMAGE_HEIGHT = 'h-[11rem] md:h-[12rem]'; // fixed banner image height

const HotelCard = ({ room, index }) => {
  const { currency } = useAppContext();

  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => scrollTo(0, 0)}
      className={[
        'relative flex flex-col overflow-hidden rounded-xl bg-white text-gray-500/90 shadow-[0_4px_4px_rgba(0,0,0,0.05)]',
        CARD_HEIGHT
      ].join(' ')}
    >
      {/* Banner image */}
      <img
        src={room.images[0]}
        alt={`${room.hotel.name} banner`}
        className={`${IMAGE_HEIGHT} w-full object-cover`}
      />

      {/* “Best Seller” badge on alternating cards */}
      {index % 2 === 0 && (
        <p className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-800">
          Best Seller
        </p>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 pt-5">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <p className="font-playfair text-xl font-medium text-gray-800">
              {room.hotel.name}
            </p>
            <div className="flex items-center gap-1">
              <img
                src={assets.starIconFilled}
                alt="star icon"
                className="h-4 w-4"
              />
              4.5
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <img
              src={assets.locationFilledIcon}
              alt="location icon"
              className="h-3 w-3"
            />
            <span className="truncate">{room.hotel.address}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p>
            <span className="text-xl text-gray-800">
              {currency} {room.pricePerNight}
            </span>
            /night
          </p>
          <button className="rounded border border-gray-300 px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 cursor-pointer">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
