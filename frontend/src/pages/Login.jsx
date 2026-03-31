import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, UserPlus, LogIn, Lock, Mail, Phone, Building, Heart, ArrowLeft } from "lucide-react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("donor"); // 'donor' | 'hospital'

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (isLogin) {
      fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsSubmitting(false);
          if (data.access) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("role", data.role);
            localStorage.setItem("is_admin", data.is_admin);
            localStorage.setItem("username", username);
            if (data.is_admin) {
              navigate("/admin-dashboard");
            } else {
              navigate(data.role === "donor" ? "/donor-dashboard" : "/hospital-dashboard");
            }
          } else {
            setError(data.error || "Invalid credentials");
          }
        })
        .catch(() => {
          setIsSubmitting(false);
          setError("Network error. Please try again.");
        });
    } else {
      fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, role, phone }),
      })
        .then(async (res) => {
          const data = await res.json();
          setIsSubmitting(false);
          if (res.ok) {
            setIsLogin(true);
            setError("");
            setPassword("");
            alert("Registration successful! Please log in.");
          } else {
            const errMsgs = Object.values(data).flat().join(", ");
            setError(errMsgs || "Registration failed");
          }
        })
        .catch(() => {
          setIsSubmitting(false);
          setError("Network error. Please try again.");
        });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900 relative overflow-hidden">
      {/* Home Button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all text-sm font-bold text-slate-600 hover:text-slate-900 z-50 border border-slate-100 group"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to Home
      </button>

      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[600px] h-[600px] bg-rose-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="bg-rose-500 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <Shield className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white tracking-tight relative z-10">{isLogin ? "Welcome Back" : "Join LifeLink"}</h2>
          <p className="text-rose-100 mt-2 text-sm font-medium relative z-10">Secure medical access</p>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
             <button 
               onClick={() => { setIsLogin(true); setError(""); }}
               className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Login
             </button>
             <button 
               onClick={() => { setIsLogin(false); setError(""); }}
               className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Register
             </button>
          </div>

          <AnimatePresence mode="wait">
             {error && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 exit={{ opacity: 0 }} 
                 className="p-3 mb-6 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg text-center"
               >
                 {error}
               </motion.div>
             )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={() => setRole("donor")}
                        className={`cursor-pointer p-3 border-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${role === 'donor' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                      >
                        <Heart size={18} /> Donor
                      </div>
                      <div 
                        onClick={() => setRole("hospital")}
                        className={`cursor-pointer p-3 border-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${role === 'hospital' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                      >
                        <Building size={18} /> Hospital
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input type="email" required={!isLogin} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input type="tel" required={!isLogin} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all" placeholder="Emergency contact" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" required className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all focus:bg-white" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="password" required className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all focus:bg-white" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(225, 29, 72, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : (isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>)}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
