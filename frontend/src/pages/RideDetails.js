import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRideById, joinRide, leaveRide, deleteRide } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import RideMap from '../components/RideMap';

const RideDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getRideById(id)
      .then(({ data }) => setRide(data))
      .catch(() => toast.error('Ride not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const isDriver = ride?.driverId?._id === user?._id;
  const isPassenger = ride?.passengers?.some((p) => p._id === user?._id);
  const canJoin = !isDriver && !isPassenger && ride?.seatsAvailable > 0 && ride?.status === 'active';
  const canLeave = isPassenger && ride?.status === 'active';

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      const { data } = await joinRide(id);
      setRide(data);
      toast.success('Joined the ride! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await leaveRide(id);
      const { data } = await getRideById(id);
      setRide(data);
      toast.success('Left the ride');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Cancel this ride? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await deleteRide(id);
      toast.success('Ride cancelled');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (d) => new Date(d).toLocaleString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });

  if (loading) return (
    <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  );

  if (!ride) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-slate-600">Ride not found</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-6">
        ← Back to Rides
      </button>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          ride.status === 'active' ? 'bg-green-100 text-green-700' :
          ride.status === 'completed' ? 'bg-blue-100 text-blue-700' :
          'bg-red-100 text-red-700'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </span>
        {isDriver && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">Your ride</span>}
      </div>

      {/* Route */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 text-center">
            <div className="text-xs text-slate-500 mb-1">FROM</div>
            <div className="text-xl font-bold text-slate-900">{ride.from}</div>
          </div>
          <div className="flex flex-col items-center gap-1 px-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="w-0.5 h-8 bg-blue-200" />
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="flex-1 text-center">
            <div className="text-xs text-slate-500 mb-1">TO</div>
            <div className="text-xl font-bold text-slate-900">{ride.to}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-500 mb-1">Date & Time</div>
            <div className="text-sm font-semibold text-slate-900">{formatDateTime(ride.date)}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-500 mb-1">Seats Left</div>
            <div className={`text-xl font-bold ${ride.seatsAvailable === 0 ? 'text-red-500' : 'text-green-600'}`}>
              {ride.seatsAvailable}/{ride.seatsTotal}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-xs text-blue-600 mb-1">Price per Seat</div>
            <div className="text-2xl font-bold text-blue-600">₹{ride.price}</div>
          </div>
        </div>

        {ride.description && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Note from driver</div>
            <p className="text-sm text-slate-700">{ride.description}</p>
          </div>
        )}
      </div>

      {/* Live Map */}
      <div className="mb-4">
        <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">📍 Route Map</div>
        <RideMap from={ride.from} to={ride.to} height="280px" />
      </div>

      {/* Driver */}
      <div className="card mb-4">
        <div className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">Driver</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              {ride.driverId?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{ride.driverId?.name}</div>
              <div className="text-xs text-slate-500">{ride.driverId?.college || 'Student'}</div>
              <div className="text-yellow-400 text-xs mt-0.5">
                {'★'.repeat(Math.round(ride.driverId?.rating || 5))}
                <span className="text-slate-400 ml-1">{(ride.driverId?.rating || 5).toFixed(1)}</span>
              </div>
            </div>
          </div>
          {!isDriver && (
            <button
              onClick={() => navigate(`/chat/${ride.driverId._id}`)}
              className="btn-secondary py-2 text-sm"
            >
              💬 Message
            </button>
          )}
        </div>
      </div>

      {/* Passengers */}
      {ride.passengers?.length > 0 && (
        <div className="card mb-4">
          <div className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">
            Passengers ({ride.passengers.length})
          </div>
          <div className="space-y-2">
            {ride.passengers.map((p) => (
              <div key={p._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                    {p.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{p.name}</span>
                  {p._id === user?._id && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>}
                </div>
                {isDriver && p._id !== user?._id && (
                  <button
                    onClick={() => navigate(`/chat/${p._id}`)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Message
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {canJoin && (
          <button onClick={handleJoin} disabled={actionLoading} className="btn-primary py-3 flex items-center justify-center gap-2">
            {actionLoading ? <Spinner size="sm" /> : `🚗 Join Ride — ₹${ride.price}`}
          </button>
        )}
        {canLeave && (
          <button onClick={handleLeave} disabled={actionLoading} className="btn-danger py-3 flex items-center justify-center gap-2">
            {actionLoading ? <Spinner size="sm" /> : 'Leave Ride'}
          </button>
        )}
        {isDriver && ride.status === 'active' && (
          <button onClick={handleDelete} disabled={actionLoading} className="btn-danger py-3 flex items-center justify-center gap-2">
            {actionLoading ? <Spinner size="sm" /> : '🗑 Cancel Ride'}
          </button>
        )}
        {ride.seatsAvailable === 0 && !isDriver && !isPassenger && (
          <div className="text-center py-3 bg-red-50 rounded-xl text-red-600 text-sm font-medium">
            Fully booked — no seats available
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetails;
