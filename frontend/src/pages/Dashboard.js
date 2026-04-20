import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRides } from '../services/api';
import RideCard from '../components/RideCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({ from: '', to: '', date: '' });
  const [applied, setApplied] = useState({});
  const navigate = useNavigate();

  const fetchRides = useCallback(async (p = 1, f = {}) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 9, ...f };
      const { data } = await getRides(params);
      setRides(data.rides);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      toast.error('Failed to load rides');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides(1, applied);
  }, [fetchRides, applied]);

  const handleSearch = (e) => {
    e.preventDefault();
    setApplied({ ...filters });
  };

  const handleClear = () => {
    setFilters({ from: '', to: '', date: '' });
    setApplied({});
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Available Rides</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? 'Loading...' : `${total} ride${total !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button onClick={() => navigate('/rides/create')} className="btn-primary flex items-center gap-2">
          <span>+</span> Post a Ride
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block uppercase tracking-wide">From</label>
            <input
              type="text"
              placeholder="Departure city..."
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="input-field text-sm py-2.5"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block uppercase tracking-wide">To</label>
            <input
              type="text"
              placeholder="Destination city..."
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="input-field text-sm py-2.5"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block uppercase tracking-wide">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="input-field text-sm py-2.5"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary py-2 text-sm flex items-center gap-2">
            🔍 Search
          </button>
          {hasFilters && (
            <button type="button" onClick={handleClear} className="btn-secondary py-2 text-sm">
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : rides.length === 0 ? (
        <EmptyState
          icon="🚗"
          title="No rides found"
          description="No rides match your search. Try different filters or be the first to post a ride!"
          action={{ label: 'Post a Ride', onClick: () => navigate('/rides/create') }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rides.map((ride) => (
              <RideCard key={ride._id} ride={ride} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                disabled={page === 1}
                onClick={() => fetchRides(page - 1, applied)}
                className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center px-4 py-2 text-sm text-slate-600 bg-white rounded-xl border border-slate-200">
                {page} / {pages}
              </span>
              <button
                disabled={page === pages}
                onClick={() => fetchRides(page + 1, applied)}
                className="btn-secondary py-2 px-4 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
