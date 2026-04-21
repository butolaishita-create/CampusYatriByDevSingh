import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createRide } from '../services/api';
import Spinner from '../components/Spinner';
import RideMap from '../components/RideMap';

const CreateRide = () => {
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    seatsTotal: 2,
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { from, to, date, seatsTotal, price } = form;
    if (!from || !to || !date || !seatsTotal || price === '') return toast.error('Please fill all required fields');
    if (new Date(date) < new Date()) return toast.error('Date must be in the future');
    setLoading(true);
    try {
      const { data } = await createRide({ ...form, price: Number(form.price), seatsTotal: Number(form.seatsTotal) });
      toast.success('Ride posted successfully! 🚗');
      navigate(`/rides/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  // Minimum datetime (now)
  const minDatetime = new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-4">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Post a Ride</h1>
        <p className="text-slate-500 text-sm mt-1">Share your trip and split costs with others</p>
      </div>

      <div className="card shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Route */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">From *</label>
              <input
                type="text"
                name="from"
                value={form.from}
                onChange={handleChange}
                placeholder="e.g. Delhi"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">To *</label>
              <input
                type="text"
                name="to"
                value={form.to}
                onChange={handleChange}
                placeholder="e.g. Chandigarh"
                className="input-field"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Date & Time *</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              min={minDatetime}
              className="input-field"
            />
          </div>

          {/* Seats & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Seats Available *</label>
              <select name="seatsTotal" value={form.seatsTotal} onChange={handleChange} className="input-field">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Price per Seat (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="200"
                min="0"
                className="input-field"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add pickup point details, luggage allowed, AC/non-AC, etc."
              rows={3}
              maxLength={300}
              className="input-field resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{form.description.length}/300</p>
          </div>

          {/* Summary card */}
          {form.from && form.to && form.price && (
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 border border-blue-100">
              <div className="font-semibold mb-1">📋 Ride Summary</div>
              <div>{form.from} → {form.to} • {form.seatsTotal} seats • ₹{form.price}/seat</div>
              {form.date && <div className="mt-0.5 text-blue-600">{new Date(form.date).toLocaleString('en-IN')}</div>}
            </div>
          )}

          {/* Route Preview Map */}
          {(form.from || form.to) && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">📍 Route Preview</label>
              <RideMap from={form.from} to={form.to} height="220px" />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading ? <Spinner size="sm" /> : '🚗 Post Ride'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRide;
