import React, { useState, useEffect } from "react";
import { Droplet, Heart, Shield, ArrowRight, Activity, Users, Building, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState({
    total_donors: 0,
    total_hospitals: 0,
    successful_donations: 0
  });

  useEffect(() => {
    fetch(`${API_URL}/api/users/stats/`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-red-500/30 selection:text-white">
      <Navbar isLanding={true} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-red-600/10 rounded-full blur-[120px] -z-10 opacity-50"></div>
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -z-10 opacity-30"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/30 text-red-500 text-xs font-bold mb-10 border border-red-900/50 backdrop-blur-md uppercase tracking-[0.2em]">
          <Activity size={14} className="animate-pulse" /> <span>Next-Gen Life Saving Network</span>
        </div>
        
        <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter mb-10 leading-[0.85] uppercase">
          Empowering <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800">Survival.</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-lg text-gray-400 mb-14 font-medium leading-relaxed">
          LifeLink is a high-performance logistics layer for blood donation. 
          Real-time synchronization between hospitals and donors when seconds matter most.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full">
          <Link to="/auth" className="px-12 py-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_-20px_rgba(220,38,38,0.5)]">
            Begin Mission <ArrowRight size={22} />
          </Link>
          <button className="px-12 py-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-lg border border-white/10 transition-all backdrop-blur-md">
            View Live Requests
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<Users className="text-red-500" />} 
            label="Active Donors" 
            value={stats.total_donors.toLocaleString() + "+"} 
            description="Verified individuals ready to help."
          />
          <StatCard 
            icon={<Building className="text-red-500" />} 
            label="Partner Institutions" 
            value={stats.total_hospitals.toLocaleString() + "+"} 
            description="Top-tier medical facilities connected."
          />
          <StatCard 
            icon={<Heart className="text-red-500" />} 
            label="Successful Saves" 
            value={stats.successful_donations.toLocaleString() + "+"} 
            description="Lives impacted through fast response."
          />
        </div>
      </section>

      {/* Features - Dark & Minimal */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl font-black mb-6 uppercase leading-none">Built for <span className="text-red-600">Critical</span> Response</h2>
            <p className="text-gray-500 text-lg">Our architecture prioritizes speed and reliability, ensuring no request goes unnoticed.</p>
          </div>
          <Link to="/auth" className="text-red-500 font-bold flex items-center gap-2 hover:gap-4 transition-all">
            LEARN MORE ABOUT OUR PROTOCOL <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FeatureBlock 
            icon={<PlusCircle size={28} />}
            title="Rapid Deployment"
            text="Hospitals broadcast needs instantly to local donors based on blood group compatibility."
          />
          <FeatureBlock 
            icon={<Activity size={28} />}
            title="Real-time Tracking"
            text="Monitor every donation from request to completion with granular status updates."
          />
          <FeatureBlock 
            icon={<Shield size={28} />}
            title="Identity Proof"
            text="Secure JWT infrastructure ensures high-integrity interaction across the entire network."
          />
        </div>
      </section>
      
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-8 grayscale opacity-50">
          <Droplet className="text-red-600" />
          <span className="text-xl font-black tracking-tighter uppercase">LifeLink</span>
        </div>
        <p className="text-gray-600 text-sm font-medium">
          © 2026 LifeLink Advanced Logistics. For medical emergencies only.
        </p>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value, description }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
      <div className="mb-6 p-3 bg-red-600/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div className="text-4xl font-black mb-2 tracking-tight">{value}</div>
      <div className="text-red-500 text-xs font-black uppercase tracking-widest mb-4">{label}</div>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureBlock({ icon, title, text }) {
  return (
    <div className="group">
      <div className="text-red-600 mb-6 group-hover:translate-x-2 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
}
