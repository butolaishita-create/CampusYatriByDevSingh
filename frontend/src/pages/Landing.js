import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '🚗', title: 'Post Rides', desc: 'Share your trip and split fuel costs with fellow students.' },
    { icon: '🔍', title: 'Find Rides', desc: 'Search rides by location and date with smart filters.' },
    { icon: '💬', title: 'Chat Securely', desc: 'Message riders directly to coordinate pickups.' },
    { icon: '⭐', title: 'Trusted Reviews', desc: 'Rate drivers and passengers for a safe community.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">CR</span>
          </div>
          <span className="font-bold text-slate-900 text-xl">Campus Rides</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')} className="btn-secondary text-sm py-2 px-4">
            Log In
          </button>
          <button onClick={() => navigate('/register')} className="btn-primary text-sm py-2 px-4">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          🎓 Built for college students
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Share Rides,<br />
          <span className="text-blue-600">Save Money</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
          Connect with students on your campus, split travel costs, and make commuting smarter and more social.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="btn-primary text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-200"
          >
            Get Started Free →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary text-base py-3.5 px-8 rounded-2xl"
          >
            Browse Rides
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {[['🚗', 'Easy Posting', 'Post in 30 sec'], ['💰', 'Save up to 70%', 'On travel costs'], ['🔒', 'Safe & Verified', 'College students only']].map(([icon, title, sub]) => (
            <div key={title} className="text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-bold text-slate-900">{title}</div>
              <div className="text-sm text-slate-500">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-blue-600 rounded-3xl p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to start riding?</h2>
          <p className="text-blue-200 mb-8">Join hundreds of students already sharing rides.</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition active:scale-95"
          >
            Create Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm border-t border-slate-100">
        © {new Date().getFullYear()} Campus Ride Share. Made for students, by students.
      </footer>
    </div>
  );
};

export default Landing;
