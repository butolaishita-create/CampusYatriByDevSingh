import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, PlusCircle, MessageSquare, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Rides', icon: <Car size={18} /> },
    { to: '/rides/create', label: 'Post Ride', icon: <PlusCircle size={18} /> },
    { to: '/chat', label: 'Messages', icon: <MessageSquare size={18} /> },
    { to: `/profile/${user?._id}`, label: 'Profile', icon: <User size={18} /> },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <svg width="40" height="28" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M42 12 A 22 22 0 1 0 42 48" stroke="#0c4a6e" strokeWidth="14" strokeLinecap="round" />
              <circle cx="42" cy="30" r="16" stroke="#f97316" strokeWidth="5" fill="white" />
              <circle cx="42" cy="30" r="4" fill="#f97316" />
              <path d="M42 34 L42 46" stroke="#f97316" strokeWidth="5" />
              <path d="M38 29 L26 25" stroke="#f97316" strokeWidth="5" />
              <path d="M46 29 L58 25" stroke="#f97316" strokeWidth="5" />
              <path d="M52 12 L68 32 L84 12" stroke="#0c4a6e" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M68 32 L68 48" stroke="#0c4a6e" strokeWidth="12" strokeLinecap="round" />
            </svg>
            <span className="font-bold text-slate-900 text-lg hidden sm:block">Campus Yatri</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm font-medium text-slate-700">
              Hi, {user?.name?.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="hidden md:block text-sm text-slate-500 hover:text-red-500 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="space-y-1">
                <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
