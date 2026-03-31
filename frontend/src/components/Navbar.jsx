import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ title, isLanding }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-700 tracking-tight cursor-pointer" onClick={() => navigate("/")}>LifeLink</span>
          </div>
          <div className="flex items-center space-x-6">
            {isLanding ? (
              <div className="flex items-center gap-4">
                <button onClick={() => navigate("/auth")} className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</button>
                <button onClick={() => navigate("/auth")} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 hover:scale-105 transition-all text-white text-sm font-bold rounded-lg shadow-sm">Register</button>
              </div>
            ) : (
              <>
                <span className="hidden sm:inline-block text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{title}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-700 hidden md:block">Hi, {userName}</span>
                  <button 
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 hover:scale-105 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
