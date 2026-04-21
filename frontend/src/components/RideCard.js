import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Star } from 'lucide-react';

const StarRating = ({ rating }) => {
  const roundedRating = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < roundedRating ? 'currentColor' : 'none'}
          className={i < roundedRating ? 'text-yellow-400' : 'text-slate-300'}
        />
      ))}
    </div>
  );
};

const RideCard = ({ ride }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const seatsLeft = ride.seatsAvailable;
  const isAlmostFull = seatsLeft <= 1;

  return (
    <div
      onClick={() => navigate(`/rides/${ride._id}`)}
      className="card cursor-pointer hover:shadow-md hover:border-blue-100 transition-all duration-200 group animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Active</span>
          </div>
          <div className="flex items-center gap-2 text-slate-900">
            <span className="font-bold text-base">{ride.from}</span>
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="font-bold text-base">{ride.to}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <div className="text-lg font-bold text-blue-600">₹{ride.price}</div>
          <div className="text-xs text-slate-500">per seat</div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-4">
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1.5">
          <Calendar size={14} className="text-slate-400" />
          <span>{formatDate(ride.date)}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1.5">
          <Clock size={14} className="text-slate-400" />
          <span>{formatTime(ride.date)}</span>
        </div>
        <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ${isAlmostFull ? 'bg-red-50 text-red-600' : 'bg-slate-50'}`}>
          <Users size={14} className={isAlmostFull ? 'text-red-500' : 'text-slate-400'} />
          <span>{seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} left</span>
        </div>
      </div>

      {/* Driver Info */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
            {ride.driverId?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{ride.driverId?.name || 'Unknown'}</div>
            {ride.driverId?.rating && <StarRating rating={ride.driverId.rating} />}
          </div>
        </div>
        <span className="text-blue-600 text-sm font-medium group-hover:underline">View →</span>
      </div>
    </div>
  );
};

export default RideCard;
