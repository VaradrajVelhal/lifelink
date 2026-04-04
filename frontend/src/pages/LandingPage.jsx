import { Droplet, Heart, Shield, ArrowRight, Activity, Users, Building } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      <Navbar isLanding={true} />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-red-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-black mb-8 border border-red-100">
          <Activity size={16} /> <span>EMERGENCY RESPONSE SYSTEM</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
          Every Drop <br/>
          <span className="text-red-600">Saves a Life.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12 font-medium leading-relaxed">
          LifeLink simplifies blood donation by connecting donors with hospitals in real-time. 
          No complex jargon, just immediate action.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link to="/auth" className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-red-100 transform hover:-translate-y-1">
            Get Started Now <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Droplet size={32} className="text-red-600" />}
            title="Blood Requests"
            description="Hospitals can create urgent blood requests that are instantly visible to all eligible donors."
          />
          <FeatureCard 
            icon={<Users size={32} className="text-blue-600" />}
            title="Donor Network"
            description="A dedicated community of donors ready to respond to emergencies and save lives."
          />
          <FeatureCard 
            icon={<Shield size={32} className="text-green-600" />}
            title="Verified Access"
            description="Secure session-based authentication ensures that only verified hospitals and donors interact."
          />
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gray-900 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-16 text-center">
          <StatBox label="Active Donors" value="1,200+" />
          <StatBox label="Partner Hospitals" value="50+" />
          <StatBox label="Successful Donations" value="4,500+" />
        </div>
      </section>
      
      <footer className="py-12 text-center text-gray-400 text-sm font-medium">
        © 2026 LifeLink Platform. Built for Maximum Impact.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:border-red-200 transition-all group">
      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div>
      <p className="text-6xl font-black text-white mb-2">{value}</p>
      <p className="text-red-500 font-black tracking-widest text-xs uppercase">{label}</p>
    </div>
  );
}
