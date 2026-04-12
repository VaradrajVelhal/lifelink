import React, { useState, useEffect } from "react";
import { Plus, Activity, Droplet, Users, Building, CheckCircle, Clock, MapPin, Phone, User, LogOut, ChevronRight, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_requests: 0,
    pending_requests: 0,
    total_donations: 0,
    accepted_requests: 0
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    blood_group: "",
    units: "",
    city: "",
    urgency: "Normal"
  });

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await fetch("http://localhost:8000/api/requests/list/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await fetch("http://localhost:8000/api/users/dashboard-stats/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Fetch Stats Error:", err);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    try {
      const res = await fetch("http://localhost:8000/api/requests/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newRequest)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        fetchStats();
      }
    } catch (err) {
      console.error("Create Request Error:", err);
    }
  };

  const handleAccept = async (id) => {
    const token = localStorage.getItem("access");
    try {
      const res = await fetch(`http://localhost:8000/api/requests/${id}/accept/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        fetchStats();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Could not accept request.");
      }
    } catch (err) {
      console.error("Accept Error:", err);
    }
  };

  const handleComplete = async (id) => {
    const token = localStorage.getItem("access");
    try {
      const res = await fetch(`http://localhost:8000/api/requests/${id}/complete/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
        fetchStats();
      }
    } catch (err) {
      console.error("Complete Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 selection:bg-red-500/30">
      <Navbar isLanding={false} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
              Command <span className="text-red-600">Center</span>
            </h1>
            <p className="text-gray-500 font-medium">Real-time logistics monitoring for {role}.</p>
          </div>

          {role === 'hospital' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-600/10"
            >
              <Plus size={18} /> Initiate Request
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {role === 'hospital' ? (
            <>
              <StatBox icon={<Activity className="text-blue-500" />} label="Active Protocols" value={stats.total_requests} />
              <StatBox icon={<Clock className="text-orange-500" />} label="Awaiting Donor" value={stats.pending_requests} />
              <StatBox icon={<CheckCircle className="text-green-500" />} label="Completed Missions" value={stats.total_requests - stats.pending_requests} />
              <StatBox icon={<Droplet className="text-red-500" />} label="Criticality Level" value="High" color="text-red-600" />
            </>
          ) : (
            <>
              <StatBox icon={<Droplet className="text-red-500" />} label="Total Units Contributed" value={stats.total_donations} />
              <StatBox icon={<Activity className="text-blue-500" />} label="Active Commitments" value={stats.accepted_requests} />
              <StatBox icon={<CheckCircle className="text-green-500" />} label="Honor Score" value={stats.total_donations * 10} />
              <StatBox icon={<Users className="text-orange-500" />} label="Network Status" value="Online" color="text-green-500" />
            </>
          )}
        </div>

        {/* Main Section */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
              <Activity className="text-red-600" size={20} /> Operational Feed
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div> Live Connection
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="px-10 py-6">Target Group</th>
                  <th className="px-10 py-6">Sector / Location</th>
                  <th className="px-10 py-6 text-center">Protocol Status</th>
                  {role === 'hospital' && <th className="px-10 py-6">Intelligence</th>}
                  <th className="px-10 py-6">Timestamp</th>
                  <th className="px-10 py-6 text-right">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-4 grayscale opacity-30">
                        <Activity size={48} className="text-gray-600" />
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-600 italic">No active operations detected</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center font-black text-red-500 text-lg border border-red-900/30">
                            {req.blood_group}
                          </div>
                          <div className="text-sm font-bold text-white uppercase tracking-tighter">{req.units} Units Ordered</div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-sm font-bold text-gray-300 uppercase">{req.city}</td>
                      <td className="px-10 py-8 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current ${req.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                            req.status === 'accepted' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-green-500/10 text-green-500'
                          }`}>
                          {req.status}
                        </span>
                      </td>
                      {role === 'hospital' && (
                        <td className="px-10 py-8">
                          {req.donor_name ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-white uppercase tracking-tight mb-1">{req.donor_name}</span>
                              <span className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer tracking-widest">{req.donor_contact}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-600 font-bold italic tracking-widest uppercase">Searching...</span>
                          )}
                        </td>
                      )}
                      <td className="px-10 py-8 text-xs font-medium text-gray-500 whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
                      <td className="px-10 py-8 text-right">
                        {role === 'donor' && req.status === 'pending' && (
                          <button
                            onClick={() => handleAccept(req.id)}
                            className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all transform group-hover:scale-105"
                          >
                            Accept Task
                          </button>
                        )}
                        {role === 'hospital' && req.status === 'accepted' && (
                          <button
                            onClick={() => handleComplete(req.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                          >
                            Close Mission
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modern Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 overflow-y-auto">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-8">
              Initiate <span className="text-red-600">Protocol</span>
            </h2>
            <form onSubmit={handleCreateRequest} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Target Group</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-red-600 transition-all text-white"
                    onChange={(e) => setNewRequest({ ...newRequest, blood_group: e.target.value })}
                    required
                  >
                    <option value="" className="bg-[#0a0a0a]">Select</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                      <option key={bg} value={bg} className="bg-[#0a0a0a]">{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Units (ML)</label>
                  <input
                    type="number" placeholder="Enter Amount" required
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-700"
                    onChange={(e) => setNewRequest({ ...newRequest, units: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Operational Sector</label>
                  <input
                    type="text" placeholder="City / Area" required
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-700"
                    onChange={(e) => setNewRequest({ ...newRequest, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Priority Class</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-red-600 transition-all text-white"
                    onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value })}
                  >
                    <option value="Normal" className="bg-[#0a0a0a]">Normal</option>
                    <option value="Urgent" className="bg-[#0a0a0a]">Urgent</option>
                    <option value="Critical" className="bg-[#0a0a0a]">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-white/5 bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/20"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, label, value, color = "text-white" }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
      <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className={`text-3xl font-black mb-1 tracking-tighter ${color}`}>{value}</div>
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}
