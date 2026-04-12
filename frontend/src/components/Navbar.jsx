import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, LogOut, User, Activity } from 'lucide-react';

function Navbar({ isLanding }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Droplet className="text-red-600 w-8 h-8 fill-red-600 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-red-600 blur-lg opacity-0 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">LifeLink</span>
        </Link>
        
        <div className="flex items-center gap-8">
          {isLanding ? (
            <div className="flex items-center gap-8">
              <Link to="/auth" className="text-xs font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]">Access Network</Link>
              <Link to="/auth" className="px-6 py-3 bg-red-600 text-white text-xs font-black rounded-xl hover:bg-red-700 transition-all hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)] uppercase tracking-widest">
                Join Mission
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-black text-gray-100 uppercase tracking-widest">{userName}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
