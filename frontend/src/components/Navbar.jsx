import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, LogOut, User } from 'lucide-react';

function Navbar({ isLanding }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("username");

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/users/logout/", { method: "POST" });
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Droplet className="text-red-700 w-8 h-8 fill-red-700 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-black tracking-tight text-gray-900 uppercase">LifeLink</span>
        </Link>
        
        <div className="flex items-center gap-8">
          {isLanding ? (
            <div className="flex items-center gap-6">
              <Link to="/auth" className="text-sm font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-widest">Sign In</Link>
              <Link to="/auth" className="px-6 py-3 bg-red-600 text-white text-sm font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">JOIN NOW</Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <User size={18} className="text-gray-400" />
                <span className="text-sm font-black text-gray-900">{userName}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
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
