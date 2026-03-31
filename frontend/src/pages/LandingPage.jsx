import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { HeartPulse, Droplet, Bell, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState, useRef } from "react";

function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, { duration: 2 });
      return animation.stop;
    }
  }, [value, count, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function LandingPage() {
  const [stats, setStats] = useState({ total_donors: 0, total_hospitals: 0, total_successful_matches: 0 });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users/stats/")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Navbar title="Welcome" isLanding={true} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-200/40 rounded-full blur-3xl -z-10 pointer-events-none"
        />
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 text-sm font-bold tracking-wide mb-6 shadow-sm border border-rose-200">
            LIFELINK IS LIVE
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Seconds Matter. <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-400">
              Save a Life Today.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 font-medium leading-relaxed">
            Your blood is a miracle looking for a place to happen. Be the reason for someone's heartbeat today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <motion.button 
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(225, 29, 72, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-rose-500 hover:bg-rose-600 transition-colors text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg"
              >
                Register as Donor <ArrowRight size={20} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white relative border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-black text-slate-900 mb-4">
              How LifeLink Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-500 text-lg max-w-2xl mx-auto">
              Powered by advanced spatial routing and real-time WebSockets, bridging the gap between donors and hospitals instantly.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors group cursor-default shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplet size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Blood Matching</h3>
              <p className="text-slate-600 leading-relaxed">Geo-spatial matching ensures you find exactly the blood group you need from donors under 15km away.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors group cursor-default shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HeartPulse size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Organ Pledging</h3>
              <p className="text-slate-600 leading-relaxed">Securely pledge life-saving organs. Hospitals are notified instantly when a critical transplant is required.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group cursor-default shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bell size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Alerts</h3>
              <p className="text-slate-600 leading-relaxed">Zero-latency WebSocket infrastructure pushes emergency popup alerts directly to your dashboard.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative Grid SVG */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center"
          >
             <motion.div variants={itemVariants}>
                <div className="flex justify-center mb-4"><HeartPulse size={48} className="text-orange-400" /></div>
                <h4 className="text-5xl font-black mb-2"><AnimatedCounter value={stats.total_donors} />+</h4>
                <p className="text-slate-400 font-bold tracking-widest text-xs">ACTIVE DONORS</p>
             </motion.div>
             <motion.div variants={itemVariants}>
                <div className="flex justify-center mb-4"><Droplet size={48} className="text-blue-400" /></div>
                <h4 className="text-5xl font-black mb-2"><AnimatedCounter value={stats.total_hospitals} />+</h4>
                <p className="text-slate-400 font-bold tracking-widest text-xs">VERIFIED HOSPITALS</p>
             </motion.div>
             <motion.div variants={itemVariants}>
                <div className="flex justify-center mb-4"><Activity size={48} className="text-rose-500" /></div>
                <h4 className="text-5xl font-black mb-2"><AnimatedCounter value={stats.total_successful_matches} /></h4>
                <p className="text-slate-400 font-bold tracking-widest text-xs">LIVES SAVED</p>
             </motion.div>
             <motion.div variants={itemVariants}>
                <div className="flex justify-center mb-4"><ShieldCheck size={48} className="text-teal-400" /></div>
                <h4 className="text-5xl font-black mb-2">&lt;15km</h4>
                <p className="text-slate-400 font-bold tracking-widest text-xs">RADIUS MATCHING</p>
             </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
