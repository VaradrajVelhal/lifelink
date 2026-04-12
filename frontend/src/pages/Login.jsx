import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, Mail, Lock, User, Phone, MapPin, Activity, ArrowRight, ShieldCheck, Building } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("donor");
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    hospital_name: "",
    password: "",
    email: "",
    phone: "",
    blood_group: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isLogin
      ? "http://localhost:8000/api/users/login/"
      : "http://localhost:8000/api/users/register/";

    // Pre-process registration data for backend mapping
    let payload = { ...formData, role };
    if (!isLogin) {
      if (role === 'donor') {
        payload.username = formData.full_name;
      } else {
        payload.username = formData.hospital_name;
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          localStorage.setItem("username", data.username);
          localStorage.setItem("role", data.role);
          navigate("/dashboard");
        } else {
          setIsLogin(true);
          setFormData({ ...formData, username: payload.username });
          alert("Registration successful! Please login.");
        }
      } else {
        setError(data.detail || data.username?.[0] || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-red-500/30">
      <Navbar isLanding={false} />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Branding/Info */}
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/30 text-red-500 text-[10px] font-black mb-8 border border-red-900/50 uppercase tracking-widest">
            <ShieldCheck size={12} /> <span>Secure Protocol 2.0</span>
          </div>
          <h2 className="text-6xl font-black mb-8 leading-[0.9] uppercase tracking-tighter">
            Access the <br />
            <span className="text-red-600">LifeLink</span> <br />
            Network.
          </h2>
          <p className="text-gray-500 text-lg max-w-md leading-relaxed mb-12">
            Join the decentralized emergency response system. Verified interaction between donors and medical institutions.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500">
                <Activity size={20} />
              </div>
              <div>
                <h4 className="font-bold uppercase text-sm tracking-tight">Real-time Sync</h4>
                <p className="text-gray-600 text-sm">Low-latency request broadcasting.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl shadow-2xl">
            <div className="flex bg-white/5 p-1 rounded-2xl mb-10 border border-white/5">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isLogin ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!isLogin ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Join Now
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button type="button" onClick={() => setRole("donor")}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${role === 'donor' ? 'bg-red-600/10 border-red-600/50 text-red-500' : 'bg-transparent border-white/5 text-gray-500 hover:border-white/10'}`}>
                    Individual Donor
                  </button>
                  <button type="button" onClick={() => setRole("hospital")}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${role === 'hospital' ? 'bg-red-600/10 border-red-600/50 text-red-500' : 'bg-transparent border-white/5 text-gray-500 hover:border-white/10'}`}>
                    Medical Center
                  </button>
                </div>
              )}

              {/* Dynamic Field Labeling */}
              <div className="space-y-4">
                <div className="relative group">
                  {isLogin ? (
                    <>
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" size={18} />
                      <input
                        type="text" name="username" placeholder="Identification Name" required
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-700"
                        onChange={handleChange} value={formData.username}
                      />
                    </>
                  ) : (
                    role === 'donor' ? (
                      <>
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" size={18} />
                        <input
                          type="text" name="full_name" placeholder="Full Name" required
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-700"
                          onChange={handleChange} value={formData.full_name}
                        />
                      </>
                    ) : (
                      <>
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-500 transition-colors" size={18} />
                        <input
                          type="text" name="hospital_name" placeholder="Hospital / Facility Name" required
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-red-600/50 focus:bg-white/[0.05] transition-all placeholder:text-gray-700"
                          onChange={handleChange} value={formData.hospital_name}
                        />
                      </>
                    )
                  )}
                </div>

                {!isLogin && (
                  <>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input
                        type="email" name="email" placeholder="Email Protocol" required
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700"
                        onChange={handleChange} value={formData.email}
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input
                        type="text" name="phone" placeholder="Contact Number" required
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700"
                        onChange={handleChange} value={formData.phone}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input
                          type="text" name="city" placeholder="Base City" required
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700"
                          onChange={handleChange} value={formData.city}
                        />
                      </div>
                      {role === 'donor' && (
                        <div className="relative group">
                          <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                          <select
                            name="blood_group" required
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-red-600/50 transition-all appearance-none text-gray-300"
                            onChange={handleChange} value={formData.blood_group}
                          >
                            <option value="" className="bg-[#0a0a0a]">Group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                              <option key={bg} value={bg} className="bg-[#0a0a0a]">{bg}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <input
                    type="password" name="password" placeholder="Key Phrase" required
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-700"
                    onChange={handleChange} value={formData.password}
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</div>}

              <button
                type="submit" disabled={loading}
                className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/10 mt-6 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? "Processing..." : isLogin ? "Initiate Entry" : "Create Account"}
                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
