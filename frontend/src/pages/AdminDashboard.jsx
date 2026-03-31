import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Users, Activity } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [data, setData] = useState({ users: [], recent_requests: [], daily_registrations: [] });

  useEffect(() => {
    const token = localStorage.getItem("access");
    fetch("http://127.0.0.1:8000/api/users/admin-dashboard/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => setData(resData))
      .catch(err => console.error(err));
  }, []);

  const chartData = {
    labels: data.daily_registrations.map(d => d.date).reverse(),
    datasets: [
      {
        label: "New Registrations",
        data: data.daily_registrations.map(d => d.count).reverse(),
        backgroundColor: "rgba(225, 29, 72, 0.7)",
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-900">
      <Navbar title="Admin Analytics" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <h2 className="text-3xl font-black mb-8 text-slate-800">Platform Health</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Users size={20} className="text-rose-500"/> User Growth (Last 7 Days)</h3>
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 overflow-y-auto max-h-80">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity size={20} className="text-rose-500"/> Recent Emergency Requests</h3>
            <div className="space-y-4">
              {data.recent_requests.map((req, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800">{req.type === 'Blood' ? '🩸' : '🫀'} {req.item}</h4>
                    <p className="text-xs text-slate-500">{req.hospital__username} • {req.city}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${req.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {req.status}
                  </span>
                </div>
              ))}
              {data.recent_requests.length === 0 && <p className="text-slate-400 text-sm">No recent activity.</p>}
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
            <h3 className="text-xl font-bold text-slate-800">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold">Username</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
               {data.users.map(u => (
                 <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                   <td className="px-6 py-4 font-bold text-slate-800">{u.username}</td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${u.role === 'donor' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                   </td>
                   <td className="px-6 py-4">{u.email}</td>
                   <td className="px-6 py-4">
                     {u.role === 'donor' ? (
                       <span className="text-slate-500 text-xs font-bold">Active</span>
                     ) : (
                       <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${u.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {u.verified ? 'Verified' : 'Pending'}
                       </span>
                     )}
                   </td>
                   <td className="px-6 py-4">{new Date(u.date_joined).toLocaleDateString()}</td>
                 </tr>
               ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </main>
    </div>
  );
}
