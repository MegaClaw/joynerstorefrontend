import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAdminAccounts, deleteAccount, updateAccount } from '../../utils/api';
import { RiEditLine, RiDeleteBinLine, RiLoader4Line } from 'react-icons/ri';

export default function AdminAccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAccounts = () => {
    setLoading(true);
    getAdminAccounts({ page, limit: 15 })
      .then(res => { setAccounts(res.data.accounts); setTotal(res.data.total); setPages(res.data.pages); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAccounts(); }, [page]);

  const handleDelete = async (id, accountId) => {
    if (!confirm(`Delete account ${accountId}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteAccount(id);
      toast.success(`${accountId} deleted`);
      fetchAccounts();
    } catch { toast.error('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const toggleSold = async (account) => {
    const fd = new FormData();
    fd.append('isSold', (!account.isSold).toString());
    try {
      await updateAccount(account._id, fd);
      toast.success(account.isSold ? 'Marked as available' : 'Marked as sold');
      fetchAccounts();
    } catch { toast.error('Failed to update'); }
  };

  const thCls = "px-4 py-3 font-display text-xs font-bold tracking-[2px] uppercase text-left border-b";
  const tdCls = "px-4 py-3 text-sm border-b";

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h2 className="font-display text-3xl font-bold tracking-[2px]">
          All Accounts <span style={{ color: 'var(--blue)', fontSize: '1rem' }}>({total})</span>
        </h2>
        <Link to="/admin/add">
          <button className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>+ Add Account</button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16" style={{ color: 'var(--blue)' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <RiLoader4Line size={36} />
          </motion.div>
        </div>
      ) : (
        <div className="border overflow-x-auto" style={{ background: 'var(--bg3)', borderColor: 'var(--border-subtle)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['ID', 'Rank', 'Region', 'Price', 'Skins', 'Status', 'Actions'].map(h => (
                  <th key={h} className={thCls} style={{ color: 'var(--text-dim)', borderColor: 'var(--border-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, i) => (
                <motion.tr key={acc._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="transition-colors duration-150"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,158,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td className={tdCls} style={{ borderColor: 'rgba(255,255,255,0.04)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{acc.accountId}</td>
                  <td className={tdCls} style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <span className={`rank-badge rank-${acc.rank}`} style={{ fontSize: '0.7rem' }}>{acc.rank} {acc.rankTier}</span>
                  </td>
                  <td className={tdCls} style={{ borderColor: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>{acc.region}</td>
                  <td className={tdCls} style={{ borderColor: 'rgba(255,255,255,0.04)', fontFamily: 'var(--font-display)', color: 'var(--blue)', fontWeight: 700 }}>${acc.price}</td>
                  <td className={tdCls} style={{ borderColor: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>{acc.skinCount}</td>
                  <td className={tdCls} style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <button onClick={() => toggleSold(acc)}
                      className="px-3 py-1 font-display text-xs tracking-wide border transition-all duration-200"
                      style={{
                        background: acc.isSold ? 'rgba(59,158,255,0.15)' : 'rgba(0,229,255,0.1)',
                        color: acc.isSold ? 'var(--blue)' : '#00e5ff',
                        borderColor: acc.isSold ? 'rgba(59,158,255,0.3)' : 'rgba(0,229,255,0.3)',
                      }}>
                      {acc.isSold ? 'SOLD' : 'AVAILABLE'}
                    </button>
                  </td>
                  <td className={tdCls} style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex gap-2">
                      <Link to={`/admin/edit/${acc._id}`}>
                        <button className="w-8 h-8 flex items-center justify-center border transition-all duration-200"
                          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                          <RiEditLine size={14} />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(acc._id, acc.accountId)} disabled={deletingId === acc._id}
                        className="w-8 h-8 flex items-center justify-center border transition-all duration-200"
                        style={{ background: 'rgba(59,158,255,0.08)', color: 'rgba(59,158,255,0.6)', borderColor: 'rgba(59,158,255,0.2)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,158,255,0.2)'; e.currentTarget.style.color = 'var(--blue)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,158,255,0.08)'; e.currentTarget.style.color = 'rgba(59,158,255,0.6)'; }}>
                        {deletingId === acc._id ? <RiLoader4Line size={14} /> : <RiDeleteBinLine size={14} />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className="w-9 h-9 font-display font-bold transition-all duration-200 border"
              style={{
                background: p === page ? 'var(--blue)' : 'var(--bg3)',
                color: p === page ? 'white' : 'var(--text-muted)',
                borderColor: p === page ? 'var(--blue)' : 'var(--border-subtle)',
              }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
