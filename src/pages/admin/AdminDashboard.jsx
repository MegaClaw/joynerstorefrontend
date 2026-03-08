import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { RiDashboardLine, RiAddLine, RiListCheck2, RiLogoutBoxLine, RiMenuLine, RiUpload2Line } from 'react-icons/ri';
import AdminAccountsList from './AdminAccountsList';
import AdminAddAccount from './AdminAddAccount';
import AdminBulkUpload from './AdminBulkUpload';
import { getAdminAccounts } from '../../utils/api';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: RiDashboardLine, exact: true },
  { path: '/admin/accounts', label: 'All Accounts', icon: RiListCheck2 },
  { path: '/admin/add', label: 'Add Account', icon: RiAddLine },
  { path: '/admin/bulk', label: 'Bulk Upload', icon: RiUpload2Line },
];

function DashboardHome() {
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0 });

  useEffect(() => {
    getAdminAccounts({ limit: 1000 }).then(res => {
      const all = res.data.accounts;
      setStats({ total: res.data.total, available: all.filter(a => !a.isSold).length, sold: all.filter(a => a.isSold).length });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="font-display text-3xl font-bold tracking-[2px] mb-8">
        Dashboard <span style={{ color: 'var(--blue)' }}>Overview</span>
      </h2>

      <div className="grid gap-6 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {[['Total Accounts', stats.total, 'var(--text)'], ['Available', stats.available, '#00e5ff'], ['Sold', stats.sold, 'var(--blue)']].map(([label, val, color]) => (
          <div key={label} className="card-clip p-6 border" style={{ background: 'var(--bg3)', borderColor: 'var(--border-subtle)' }}>
            <div className="font-display font-bold" style={{ fontSize: '2.5rem', color, lineHeight: 1 }}>{val}</div>
            <div className="font-mono tracking-[2px] uppercase mt-2" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {[
          { to: '/admin/add', label: 'Add New Account', icon: RiAddLine },
          { to: '/admin/bulk', label: 'Bulk Upload', icon: RiUpload2Line },
          { to: '/admin/accounts', label: 'Manage Accounts', icon: RiListCheck2 },
        ].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to}>
            <div className="flex items-center gap-3 p-5 border transition-all duration-200 cursor-pointer"
              style={{ background: 'var(--bg4)', borderColor: 'var(--border-subtle)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,158,255,0.5)'; e.currentTarget.style.background = 'var(--bg3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg4)'; }}
            >
              <Icon size={20} style={{ color: 'var(--blue)' }} />
              <span className="font-display font-semibold tracking-wide">{label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/admin/login'); };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg1)' }}>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col border-r transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: 240, background: 'var(--bg2)', borderColor: 'var(--border-subtle)' }}>

        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center"
              style={{ background: 'var(--blue)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <span className="text-white font-display font-black text-xs">J</span>
            </div>
            <span className="font-display text-lg font-bold tracking-[2px]">
              Joyner<span style={{ color: 'var(--blue)' }}>Store</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {navItems.map(({ path, label, icon: Icon, exact }) => {
            const isActive = exact ? location.pathname === '/admin' : location.pathname.startsWith(path) && path !== '/admin';
            return (
              <Link key={path} to={path} onClick={() => setSidebarOpen(false)}>
                <div className="flex items-center gap-3 px-6 py-3 transition-all duration-200 cursor-pointer border-l-[3px]"
                  style={{
                    background: isActive ? 'rgba(59,158,255,0.1)' : 'transparent',
                    borderLeftColor: isActive ? 'var(--blue)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-muted)',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Icon size={18} />
                  <span className="font-display text-sm tracking-[1.5px] uppercase">{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 border font-display text-sm tracking-[1.5px] uppercase transition-all duration-200"
            style={{ background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.borderColor = 'rgba(59,158,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <RiLogoutBoxLine /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-60 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex items-center gap-4 px-8 py-4 border-b"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border-subtle)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden bg-transparent text-xl" style={{ color: 'var(--text)' }}>
            <RiMenuLine />
          </button>
          <span className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>Admin Panel</span>
          <div className="ml-auto">
            <Link to="/" target="_blank">
              <button className="px-4 py-2 border font-display text-xs tracking-wide transition-all duration-200"
                style={{ background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.borderColor = 'var(--blue)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >View Site</button>
            </Link>
          </div>
        </div>

        <div className="p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/accounts" element={<AdminAccountsList />} />
            <Route path="/add" element={<AdminAddAccount />} />
            <Route path="/edit/:id" element={<AdminAddAccount />} />
            <Route path="/bulk" element={<AdminBulkUpload />} />
          </Routes>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
