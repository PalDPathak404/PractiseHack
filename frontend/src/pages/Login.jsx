import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px] animate-pulse-slow font-sans" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px] animate-pulse-slow font-sans" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-6 font-sans shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            <Shield size={40} />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">SENTINEL <span className="text-primary">GRID</span></h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-widest uppercase">Secure Border Management System</p>
        </div>

        <div className="glass p-8 rounded-3xl border-white/10 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:bg-white/10 focus:border-primary outline-none transition-all shadow-inner"
                  placeholder="name@sentinel.gov"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2 ml-1">Access Token / Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:bg-white/10 focus:border-primary outline-none transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-medium flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Authenticate Access
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs">
              Restricted to authorized personnel only. 
              <br/>All login attempts are logged for audit.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-6 opacity-30 grayscale hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 grayscale brightness-200">
             {/* Mock Badges */}
             <div className="w-8 h-8 rounded bg-white/20" />
             <div className="w-20 h-4 rounded-full bg-white/20" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
