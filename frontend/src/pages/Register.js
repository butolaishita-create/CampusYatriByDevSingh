import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await register(form);
      console.log('✅ Registration response:', data); // Debug log
      loginUser(data, data.token);
      toast.success(`Welcome to Campus Yatri, ${data.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Registration error:', err); // Debug log
      console.error('Error details:', err.response?.data); // Debug log
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg width="48" height="34" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42 12 A 22 22 0 1 0 42 48" stroke="#0c4a6e" strokeWidth="14" strokeLinecap="round" />
              <circle cx="42" cy="30" r="16" stroke="#f97316" strokeWidth="5" fill="white" />
              <circle cx="42" cy="30" r="4" fill="#f97316" />
              <path d="M42 34 L42 46" stroke="#f97316" strokeWidth="5" />
              <path d="M38 29 L26 25" stroke="#f97316" strokeWidth="5" />
              <path d="M46 29 L58 25" stroke="#f97316" strokeWidth="5" />
              <path d="M52 12 L68 32 L84 12" stroke="#0c4a6e" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M68 32 L68 48" stroke="#0c4a6e" strokeWidth="12" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Start sharing rides today</p>
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Arjun Sharma"
                className="input-field"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                className="input-field"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">College / University</label>
              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="IIT Delhi, DU, etc."
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="input-field"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2 py-3">
              {loading ? <Spinner size="sm" /> : 'Create Account →'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-slate-400 hover:text-slate-600">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
