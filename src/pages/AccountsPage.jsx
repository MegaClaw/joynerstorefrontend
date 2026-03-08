import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AccountCard from '../components/AccountCard';
import { getAccounts } from '../utils/api';
import { RiFilterLine, RiLoader4Line } from 'react-icons/ri';

const RANKS = ['Iron','Bronze','Silver','Gold','Platinum','Diamond','Ascendant','Immortal','Radiant'];
const REGIONS = ['NA','EU','AP','KR','BR','LATAM','TR','ME'];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ rank: '', region: '', minPrice: '', maxPrice: '', sort: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAccounts({ ...filters, page, limit: 12 })
      .then(res => { setAccounts(res.data.accounts); setTotal(res.data.total); setPages(res.data.pages); })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const handleFilter = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1); };
  const clearFilters = () => { setFilters({ rank: '', region: '', minPrice: '', maxPrice: '', sort: '' }); setPage(1); };

  const inputCls = "w-full font-body text-base px-4 py-2.5 transition-colors duration-200 outline-none";
  const inputStyle = { background: 'var(--bg3)', border: '1px solid var(--border-subtle)', color: 'var(--text)', borderRadius: 0 };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg1)' }}>
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden border-b pt-24 pb-12" style={{ background: 'var(--bg2)', borderColor: 'var(--border-subtle)' }}>
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="section-label">All Listings</div>
          <h1 className="section-title">Browse <span style={{ color: 'var(--blue)' }}>Accounts</span></h1>
          <p className="mt-2" style={{ color: 'var(--text-muted)' }}>{total} accounts available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 flex-1 w-full">
        {/* Filter bar */}
        <div className="flex gap-4 flex-wrap items-center p-5 mb-8 border"
          style={{ background: 'var(--bg3)', borderColor: 'var(--border-subtle)' }}>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 font-display tracking-[2px] text-sm uppercase transition-all duration-200 border"
            style={{
              background: showFilters ? 'var(--blue)' : 'transparent',
              color: showFilters ? 'white' : 'var(--text-muted)',
              borderColor: showFilters ? 'var(--blue)' : 'var(--border-subtle)',
            }}>
            <RiFilterLine /> Filters
          </button>

          <select value={filters.sort} onChange={e => handleFilter('sort', e.target.value)}
            className={inputCls} style={{ ...inputStyle, flex: 1, minWidth: 160 }}>
            <option value="">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rank">By Rank</option>
          </select>

          {(filters.rank || filters.region || filters.minPrice || filters.maxPrice) && (
            <button onClick={clearFilters} className="px-4 py-2 font-display tracking-wide text-sm uppercase border transition-all duration-200"
              style={{ background: 'transparent', color: 'var(--blue)', borderColor: 'rgba(59,158,255,0.3)' }}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="grid gap-4 p-6 mb-8 border"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', background: 'var(--bg3)', borderColor: 'var(--border-subtle)' }}>
            {[
              { label: 'RANK', key: 'rank', opts: RANKS, placeholder: 'All Ranks' },
              { label: 'REGION', key: 'region', opts: REGIONS, placeholder: 'All Regions' },
            ].map(({ label, key, opts, placeholder }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <select value={filters[key]} onChange={e => handleFilter(key, e.target.value)}
                  className={inputCls} style={inputStyle}>
                  <option value="">{placeholder}</option>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="admin-label">MIN PRICE ($)</label>
              <input type="number" placeholder="0" value={filters.minPrice}
                onChange={e => handleFilter('minPrice', e.target.value)}
                className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="admin-label">MAX PRICE ($)</label>
              <input type="number" placeholder="9999" value={filters.maxPrice}
                onChange={e => handleFilter('maxPrice', e.target.value)}
                className={inputCls} style={inputStyle} />
            </div>
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-72" style={{ color: 'var(--blue)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <RiLoader4Line size={40} />
            </motion.div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-dim)' }}>
            <div className="font-display text-2xl mb-2">No accounts found</div>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {accounts.map((acc, i) => (
              <motion.div key={acc._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <AccountCard account={acc} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-10 h-10 font-display font-bold transition-all duration-200 border"
                style={{
                  background: p === page ? 'var(--blue)' : 'var(--bg3)',
                  color: p === page ? 'white' : 'var(--text-muted)',
                  borderColor: p === page ? 'var(--blue)' : 'var(--border-subtle)',
                }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
