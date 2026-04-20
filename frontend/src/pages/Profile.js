import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUserById, getUserRides, updateProfile, rateUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-2xl transition-transform hover:scale-110 ${star <= value ? 'text-yellow-400' : 'text-slate-300'}`}
      >
        ★
      </button>
    ))}
  </div>
);

const Profile = () => {
  const { userId } = useParams();
  const { user: authUser, setUser } = useAuth();
  const navigate = useNavigate();

  const targetId = userId || authUser?._id;
  const isOwnProfile = !userId || userId === authUser?._id;

  const [profileUser, setProfileUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', college: '' });
  const [saving, setSaving] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    if (!targetId) return;
    Promise.all([
      getUserById(targetId),
      getUserRides(targetId),
    ])
      .then(([uRes, rRes]) => {
        setProfileUser(uRes.data);
        setEditForm({ name: uRes.data.name, college: uRes.data.college || '' });
        setRides(rRes.data);
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [targetId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfile(editForm);
      setProfileUser((prev) => ({ ...prev, ...data }));
      setUser((prev) => ({ ...prev, ...data }));
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRate = async () => {
    if (!ratingValue) return toast.error('Please select a rating');
    setRatingLoading(true);
    try {
      await rateUser(targetId, ratingValue);
      toast.success('Rating submitted!');
      setRatingValue(0);
      // Refresh
      const { data } = await getUserById(targetId);
      setProfileUser(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to rate');
    } finally {
      setRatingLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!profileUser) return <div className="text-center py-20 text-slate-500">User not found</div>;

  const drivenRides = rides.filter((r) => r.driverId?._id === targetId);
  const joinedRides = rides.filter((r) => r.driverId?._id !== targetId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {!isOwnProfile && (
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-6">
          ← Back
        </button>
      )}

      {/* Profile Card */}
      <div className="card mb-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
              {profileUser.name?.[0]?.toUpperCase()}
            </div>
            <div>
              {editing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field text-lg font-bold mb-1 py-1.5"
                />
              ) : (
                <h1 className="text-xl font-bold text-slate-900">{profileUser.name}</h1>
              )}
              <p className="text-sm text-slate-500">{profileUser.email}</p>
              {editing ? (
                <input
                  type="text"
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  placeholder="College name"
                  className="input-field text-sm mt-1.5 py-1.5"
                />
              ) : profileUser.college ? (
                <p className="text-sm text-blue-600 font-medium mt-0.5">🎓 {profileUser.college}</p>
              ) : null}
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={handleSave} disabled={saving} className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1">
                    {saving ? <Spinner size="sm" /> : '✓ Save'}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary py-1.5 px-3 text-sm">Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-secondary py-1.5 px-3 text-sm">Edit</button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{drivenRides.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Rides Driven</div>
          </div>
          <div className="text-center border-x border-slate-100">
            <div className="text-2xl font-bold text-slate-900">{joinedRides.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Rides Joined</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{(profileUser.rating || 5).toFixed(1)}</div>
            <div className="text-xs text-slate-500 mt-0.5">Rating</div>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-400 text-center">
          Member since {formatDate(profileUser.createdAt)}
        </div>
      </div>

      {/* Rate User (not own profile) */}
      {!isOwnProfile && (
        <div className="card mb-5">
          <div className="font-semibold text-slate-900 mb-3">Rate this user</div>
          <StarPicker value={ratingValue} onChange={setRatingValue} />
          <button
            onClick={handleRate}
            disabled={!ratingValue || ratingLoading}
            className="btn-primary mt-3 py-2 text-sm flex items-center gap-2"
          >
            {ratingLoading ? <Spinner size="sm" /> : 'Submit Rating'}
          </button>
        </div>
      )}

      {/* Ride History */}
      <div className="card">
        <div className="font-semibold text-slate-900 mb-4">Ride History</div>
        {rides.length === 0 ? (
          <EmptyState icon="🚗" title="No rides yet" description={isOwnProfile ? "Post or join your first ride!" : "This user hasn't taken any rides yet."} />
        ) : (
          <div className="space-y-3">
            {rides.map((ride) => {
              const isDriver = ride.driverId?._id === targetId;
              return (
                <div
                  key={ride._id}
                  onClick={() => navigate(`/rides/${ride._id}`)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{isDriver ? '🚗' : '👤'}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {ride.from} → {ride.to}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(ride.date).toLocaleDateString('en-IN')} · {isDriver ? 'Driver' : 'Passenger'} · ₹{ride.price}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ride.status === 'active' ? 'bg-green-100 text-green-700' :
                      ride.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {ride.status}
                    </span>
                    <span className="text-blue-500 text-sm group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
