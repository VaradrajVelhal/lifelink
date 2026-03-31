import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

function HospitalDashboard() {
  const [requestType, setRequestType] = useState("blood");
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [city, setCity] = useState("");
  const [urgency, setUrgency] = useState("");
  const [organType, setOrganType] = useState("");
  
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total_requests: 0 });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const fetchStats = () => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/users/dashboard-stats/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  };

  const fetchRequests = () => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/requests/list/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requestType === "blood" && (!bloodGroup || !units || !city || !urgency)) {
      setAlert({ message: "Please fill out all fields for blood request.", type: "error" });
      return;
    }
    if (requestType === "organ" && (!organType || !city || !urgency)) {
      setAlert({ message: "Please fill out all fields for organ request.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("access");
    
    const url = requestType === "blood" ? "http://127.0.0.1:8000/api/requests/create/" : "http://127.0.0.1:8000/api/requests/create/organ/";
    const bodyArgs = requestType === "blood" ? { blood_group: bloodGroup, units: Number(units), city, urgency } : { organ_type: organType, city, urgency };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyArgs),
    })
      .then((res) => {
        setIsSubmitting(false);
        if (res.ok) {
          setAlert({ message: `${requestType === 'blood' ? 'Blood' : 'Organ'} request created successfully!`, type: "success" });
          setBloodGroup(""); setUnits(""); setCity(""); setUrgency(""); setOrganType("");
          fetchRequests();
          fetchStats();
        } else {
          setAlert({ message: "Failed to create request.", type: "error" });
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        setAlert({ message: "An error occurred.", type: "error" });
      });
  };

  const markFulfilled = (id) => {
    const token = localStorage.getItem("access");
    fetch(`http://127.0.0.1:8000/api/requests/${id}/fulfill/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setAlert({ message: "Request marked as fulfilled.", type: "success" });
          fetchRequests();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-900">
      <Navbar title="Hospital Dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {alert.message && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-semibold ${alert.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            <div className="flex justify-between items-center">
              <span>{alert.message}</span>
              <button onClick={() => setAlert({ message: "", type: "" })} className="text-xl">&times;</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-4 bg-rose-100 text-rose-600 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Requests</p>
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-400">{stats.total_requests}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
                  Create Request
                </h3>
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <button onClick={() => setRequestType("blood")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${requestType === "blood" ? "bg-rose-500 text-white shadow-md shadow-rose-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    🩸 Blood
                  </button>
                  <button onClick={() => setRequestType("organ")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${requestType === "organ" ? "bg-teal-500 text-white shadow-md shadow-teal-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    🫀 Organ
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {requestType === "blood" ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blood Group</label>
                        <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                          <option value="">Select...</option>
                          <option value="A+">A+</option><option value="A-">A-</option>
                          <option value="B+">B+</option><option value="B-">B-</option>
                          <option value="AB+">AB+</option><option value="AB-">AB-</option>
                          <option value="O+">O+</option><option value="O-">O-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Units Needed</label>
                        <input type="number" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2" value={units} onChange={(e) => setUnits(e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Organ Type</label>
                      <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" value={organType} onChange={(e) => setOrganType(e.target.value)}>
                        <option value="">Select Organ...</option>
                        <option value="Kidney">Kidney</option>
                        <option value="Liver">Liver</option>
                        <option value="Heart">Heart</option>
                        <option value="Lungs">Lungs</option>
                        <option value="Pancreas">Pancreas</option>
                        <option value="Corneas">Corneas</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Mumbai" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Urgency</label>
                    <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                      <option value="">Select...</option>
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md disabled:opacity-70">
                    {isSubmitting ? "Processing..." : `Submit ${requestType === 'blood' ? 'Blood' : 'Organ'} Request`}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-7">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {requests.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="bg-slate-50 p-4 rounded-full mb-4"
                    >
                      <Inbox size={32} className="text-slate-300" />
                    </motion.div>
                    <p className="font-medium">No active requests found.</p>
                </motion.div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {req.organ_type ? (
                          <h4 className="text-lg font-bold text-teal-700">🫀 {req.organ_type} Needed</h4>
                        ) : (
                          <h4 className="text-lg font-bold text-rose-600">🩸 {req.blood_group} ({req.units} units)</h4>
                        )}
                        <p className="text-sm text-slate-500 mt-1">📍 {req.city}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${req.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {req.status === 'fulfilled' ? 'Fulfilled' : 'Pending'}
                      </span>
                    </div>
                    {req.status !== "fulfilled" && (
                      <div className="mt-4 pt-4 border-t border-slate-50 flex gap-3">
                        <button onClick={() => markFulfilled(req.id)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                          Confirm Fulfillment
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HospitalDashboard;
