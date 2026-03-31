import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { BellOff, History } from "lucide-react";

function DonorDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [donations, setDonations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [stats, setStats] = useState({ total_donations: 0, unread_notifications: 0 });

  const [bloodGroup, setBloodGroup] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [organType, setOrganType] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ message: "", type: "" });
  
  const ws = useRef(null);

  const fetchStats = () => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/users/dashboard-stats/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  };

  const fetchNotifications = () => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/requests/notifications/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error(err));
  };

  const fetchHospitals = () => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/donors/hospitals/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHospitals(data))
      .catch((err) => console.error(err));
  };

  const fetchDonations = () => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/donors/donations/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDonations(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStats();
    fetchNotifications();
    fetchHospitals();
    fetchDonations();

    // Setup WebSockets
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // add to top of feed
      setNotifications(prev => [{id: Date.now(), message: data.message, is_read: false}, ...prev]);
      setAlertInfo({ message: "🚨 URGENT: " + data.message, type: "error" });
      fetchStats();
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const markAsRead = (id) => {
    const token = localStorage.getItem("access");
    fetch(`http://127.0.0.1:8000/api/requests/notifications/${id}/read/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        fetchNotifications();
        fetchStats();
      })
      .catch((err) => console.error(err));
  };

  const handleLogDonation = (e) => {
    e.preventDefault();
    if (!bloodGroup || !hospitalId) {
      setAlertInfo({ message: "Please select blood group and hospital.", type: "error" });
      return;
    }
    
    setIsSubmitting(true);
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/donors/donate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ blood_group: bloodGroup, hospital: hospitalId }),
    })
      .then((res) => {
        setIsSubmitting(false);
        if (res.ok) {
          setAlertInfo({ message: "Donation logged successfully!", type: "success" });
          setBloodGroup(""); setHospitalId("");
          fetchDonations(); fetchStats();
        } else {
          setAlertInfo({ message: "Failed to log donation.", type: "error" });
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        setAlertInfo({ message: "An error occurred.", type: "error" });
      });
  };

  const handleOrganPledge = (e) => {
    e.preventDefault();
    if (!organType) {
      setAlertInfo({ message: "Please select an organ.", type: "error" });
      return;
    }
    
    setIsSubmitting(true);
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/donors/pledge-organ/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ organ_type: organType }),
    })
      .then((res) => {
        setIsSubmitting(false);
        if (res.ok) {
          setAlertInfo({ message: "Organ pledged successfully! Thank you for being a hero.", type: "success" });
          setOrganType("");
        } else {
          setAlertInfo({ message: "Failed to pledge organ.", type: "error" });
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        setAlertInfo({ message: "An error occurred.", type: "error" });
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-900">
      <Navbar title="Donor Dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Animated Alert for popups */}
        {alertInfo.message && (
          <div className={`p-4 mb-6 rounded-lg shadow-lg font-semibold transform transition-all duration-300 ${alertInfo.type === 'error' ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-green-800'}`}>
            <div className="flex justify-between items-center">
              <span>{alertInfo.message}</span>
              <button onClick={() => setAlertInfo({ message: "", type: "" })} className="text-xl hover:opacity-75">&times;</button>
            </div>
          </div>
        )}
        
        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center group hover:border-transparent hover:shadow-md transition-all">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Donations</p>
              <h3 className="text-4xl font-black text-rose-500">{stats.total_donations}</h3>
            </div>
            <div className="p-4 bg-rose-50 text-rose-500 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center group hover:border-transparent hover:shadow-md transition-all">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Unread Alerts</p>
              <h3 className="text-4xl font-black text-amber-500">{stats.unread_notifications}</h3>
            </div>
            <div className="p-4 bg-amber-50 text-amber-500 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Action Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Live Feed Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live Notifications
                </h4>
              </div>
              <div className="p-0">
                {notifications.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-slate-400"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="bg-slate-50 p-4 rounded-full mb-4"
                    >
                      <BellOff size={32} className="text-slate-300" />
                    </motion.div>
                    <p className="font-medium">No active alerts right now.</p>
                    <p className="text-xs mt-1 text-slate-300">You're all caught up!</p>
                  </motion.div>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                       <div key={n.id} className={`p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between ${n.is_read ? "bg-white" : "bg-blue-50/50"}`}>
                         <div className="flex gap-3">
                           {!n.is_read && <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>}
                           <p className={`text-sm ${n.is_read ? 'text-slate-500' : 'text-slate-800 font-semibold'} leading-snug`}>{n.message}</p>
                         </div>
                         {!n.is_read && (
                           <button onClick={() => markAsRead(n.id)} className="whitespace-nowrap px-4 py-2 text-xs font-bold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                             Acknowledge
                           </button>
                         )}
                       </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Forms Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Log Donation */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800">🩸 Log Blood Donation</h4>
                </div>
                <div className="p-6">
                  <form onSubmit={handleLogDonation} className="space-y-4">
                    <div>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                        <option value="">Blood Group...</option>
                        <option value="A+">A+</option><option value="A-">A-</option>
                        <option value="B+">B+</option><option value="B-">B-</option>
                        <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        <option value="O+">O+</option><option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
                        <option value="">Hospital...</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                      </select>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow shadow-rose-200">
                      Submit Log
                    </button>
                  </form>
                </div>
              </div>

              {/* Pledge Organ */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800">🫀 Pledge an Organ</h4>
                </div>
                <div className="p-6">
                  <form onSubmit={handleOrganPledge} className="space-y-4">
                    <div>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" value={organType} onChange={(e) => setOrganType(e.target.value)}>
                        <option value="">Select Organ to Pledge...</option>
                        <option value="Kidney">Kidney</option>
                        <option value="Liver">Liver</option>
                        <option value="Heart">Heart</option>
                        <option value="Lungs">Lungs</option>
                        <option value="Pancreas">Pancreas</option>
                        <option value="Corneas">Corneas</option>
                      </select>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">Your pledge will be saved and used if an urgent match is requested within a 15km radius.</p>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow shadow-teal-200">
                      Pledge Organ
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Area for History */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                <h5 className="font-bold text-slate-800">History</h5>
              </div>
              <div className="p-0">
                {donations.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-slate-400"
                  >
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                      <History size={32} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-medium">No donations logged yet.</p>
                  </motion.div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {donations.map((d) => (
                      <li key={d.id} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <h6 className="font-black text-lg text-rose-500">{d.blood_group}</h6>
                          <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors bg-white border border-slate-200 px-2 py-1 rounded-md">{new Date(d.date_donated).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                          {d.hospital_name}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DonorDashboard;
