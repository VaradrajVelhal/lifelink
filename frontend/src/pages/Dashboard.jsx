import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  User, 
  LogOut, 
  Activity, 
  Droplet,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [requests, setRequests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchUserInfo();
    fetchStats();
    fetchRequests();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/me/", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        navigate("/auth");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/dashboard-stats/", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/requests/list/", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("http://127.0.0.1:8000/api/users/logout/", { method: "POST", credentials: "include" });
    localStorage.clear();
    navigate("/auth");
  };

  const handleAcceptRequest = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/requests/${id}/accept/`, { method: "POST", credentials: "include" });
      if (res.ok) {
        alert("Request accepted!");
        fetchRequests();
        fetchStats();
      }
    } catch (err) {
      alert("Failed to accept request");
    }
  };

  const handleCompleteRequest = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/requests/${id}/complete/`, { method: "POST", credentials: "include" });
      if (res.ok) {
        alert("Request completed!");
        fetchRequests();
        fetchStats();
      }
    } catch (err) {
      alert("Failed to complete request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Droplet className="text-red-600 w-8 h-8 fill-red-600" />
          <h1 className="text-2xl font-black tracking-tight">LifeLink</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <section className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black">Hello, {user?.username}!</h2>
            <p className="text-gray-500 mt-2">Manage your {role === 'donor' ? 'donations' : 'requests'} and save lives today.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-100 px-6 py-3 rounded-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role</p>
              <p className="text-lg font-black capitalize">{role}</p>
            </div>
            {role === 'hospital' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-100"
              >
                <PlusCircle size={20} /> New Request
              </button>
            )}
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {role === 'hospital' ? (
            <>
              <StatCard icon={<Activity className="text-blue-600"/>} label="Total Requests" value={stats.total_requests || 0} color="bg-blue-50" />
              <StatCard icon={<Clock className="text-orange-600"/>} label="Pending" value={stats.pending_requests || 0} color="bg-orange-50" />
              <StatCard icon={<CheckCircle2 className="text-green-600"/>} label="Success Rate" value="100%" color="bg-green-50" />
            </>
          ) : (
            <>
              <StatCard icon={<Droplet className="text-red-600"/>} label="Total Donations" value={stats.total_donations || 0} color="bg-red-50" />
              <StatCard icon={<History className="text-purple-600"/>} label="Accepted" value={stats.accepted_requests || 0} color="bg-purple-50" />
              <StatCard icon={<User className="text-indigo-600"/>} label="Profile Multiplier" value="1.5x" color="bg-indigo-50" />
            </>
          )}
        </section>

        {/* Dynamic Table/List */}
        <section className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xl font-black">{role === 'hospital' ? 'My Active Requests' : 'Available Requests'}</h3>
            <button onClick={fetchRequests} className="text-sm font-bold text-red-600 hover:underline">Refresh</button>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-400 font-medium">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium">No requests found at the moment.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Blood Group</th>
                    <th className="px-8 py-4">Location</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold">{req.blood_group}</span>
                          <span className="text-sm font-bold text-gray-600">{req.units} Units</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium">{req.city}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          req.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                          req.status === 'accepted' ? 'bg-blue-100 text-blue-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-5 text-right">
                        {role === 'donor' && req.status === 'pending' && (
                          <button 
                            onClick={() => handleAcceptRequest(req.id)}
                            className="text-white bg-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                          >
                            Accept
                          </button>
                        )}
                        {role === 'hospital' && req.status === 'accepted' && (
                          <button 
                            onClick={() => handleCompleteRequest(req.id)}
                            className="text-white bg-green-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all"
                          >
                            Mark Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Simplified Create Modal */}
      {showCreateModal && (
        <CreateRequestModal onClose={() => setShowCreateModal(false)} onCreated={() => { fetchRequests(); fetchStats(); }} />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black mt-1">{value}</p>
      </div>
    </div>
  );
}

function CreateRequestModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    blood_group: "A+",
    units: 1,
    city: "",
    urgency: "normal"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/requests/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (res.ok) {
        onCreated();
        onClose();
      }
    } catch (err) {
      alert("Error creating request");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
        <h3 className="text-2xl font-black mb-6">Create Blood Request</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Blood Group</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-red-600"
              value={formData.blood_group}
              onChange={e => setFormData({...formData, blood_group: e.target.value})}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Units Required</label>
            <input 
              type="number" min="1" required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-600"
              value={formData.units}
              onChange={e => setFormData({...formData, units: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City</label>
            <input 
              type="text" required placeholder="e.g. Mumbai"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-600"
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
