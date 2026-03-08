import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { RiLockLine, RiUserLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !password) return toast.error('Enter credentials');
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg1)' }}>
      <div className="grid-bg absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,158,255,0.08) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 card-clip border w-full max-w-md mx-4 p-12"
        style={{ background: 'var(--bg2)', borderColor: 'rgba(59,158,255,0.25)', boxShadow: '0 0 60px rgba(59,158,255,0.1)' }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-primary mx-auto mb-4 flex items-center justify-center"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: 'var(--blue)' }}>
            <span className="text-white font-display font-black text-lg">J</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[3px] uppercase">
            Joyner <span style={{ color: 'var(--blue)' }}>Admin</span>
          </h1>
          <p className="font-mono mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>AUTHORIZED ACCESS ONLY</p>
        </div>

        {/* Inputs */}
        <div onKeyDown={e => e.key === 'Enter' && handleSubmit()}>
          <div className="relative mb-4">
            <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 z-10" style={{ color: 'var(--blue)' }} />
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              className="admin-input pl-10" />
          </div>
          <div className="relative mb-8">
            <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 z-10" style={{ color: 'var(--blue)' }} />
            <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="admin-input pl-10 pr-12" />
            <button onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent"
              style={{ color: 'var(--text-dim)' }}>
              {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full text-center py-4"
            style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
