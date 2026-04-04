import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, ArrowRight, UserPlus, LogIn, Lock, Mail, Phone, Building, Heart, Droplet } from "lucide-react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("donor");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const url = isLogin ? "http://127.0.0.1:8000/api/users/login/" : "http://127.0.0.1:8000/api/users/register/";
    const body = isLogin ? { username, password } : { username, password, email, role, phone };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("username", data.username);
          localStorage.setItem("role", data.role);
          navigate("/dashboard");
        } else {
          setIsLogin(true);
          setPassword("");
          alert("Registration successful! Please log in.");
        }
      } else {
        setError(data.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setIsSubmitting(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-gray-900 border-t-8 border-red-600">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-3xl mb-6 shadow-sm border border-red-100">
            <Droplet className="text-red-600 w-10 h-10 fill-red-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">LifeLink</h1>
          <p className="text-gray-500 font-medium mt-2">Saving lives through simplicity.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-gray-100">
          <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-4 mb-8 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Account Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setRole("donor")}
                      className={`cursor-pointer p-4 border-2 rounded-2xl flex items-center justify-center gap-3 font-black transition-all ${role === 'donor' ? 'border-red-600 bg-red-50 text-red-600 shadow-lg shadow-red-50' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                    >
                      <Heart size={20} /> Donor
                    </div>
                    <div 
                      onClick={() => setRole("hospital")}
                      className={`cursor-pointer p-4 border-2 rounded-2xl flex items-center justify-center gap-3 font-black transition-all ${role === 'hospital' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-50' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                    >
                      <Building size={20} /> Hospital
                    </div>
                  </div>
                </div>

                <InputField 
                  icon={<Mail />} 
                  label="Email Address" 
                  type="email" 
                  placeholder="name@email.com" 
                  value={email} 
                  onChange={setEmail} 
                />
                
                <InputField 
                  icon={<Phone />} 
                  label="Phone Number" 
                  type="tel" 
                  placeholder="+91 00000 00000" 
                  value={phone} 
                  onChange={setPhone} 
                />
              </>
            )}

            <InputField 
              icon={<Shield />} 
              label="Username" 
              type="text" 
              placeholder="johndoe" 
              value={username} 
              onChange={setUsername} 
            />

            <InputField 
              icon={<Lock />} 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={setPassword} 
            />

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : (isLogin ? <><LogIn size={20} /> Sign In</> : <><UserPlus size={20} /> Join Now</>)}
              {!isSubmitting && <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-red-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors">
          {icon}
        </div>
        <input 
          type={type} 
          required 
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all" 
          placeholder={placeholder} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
        />
      </div>
    </div>
  );
}

function AlertCircle({ size }) {
  return <div className="p-1 rounded-full bg-red-600 text-white"><Shield size={size / 1.5} /></div>;
}

export default Login;
