import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bulkCreateAccounts, createAccount } from '../../utils/api';
import { RiAddLine, RiDeleteBinLine, RiUpload2Line, RiLoader4Line, RiImageLine } from 'react-icons/ri';

const RANKS = ['Iron','Bronze','Silver','Gold','Platinum','Diamond','Ascendant','Immortal','Radiant'];
const REGIONS = ['NA','EU','AP','KR','BR','LATAM','TR','ME'];
const emptyRow = () => ({ rank: 'Gold', rankTier: '1', region: 'NA', price: '', skinCount: '', level: '', description: '', images: [], previewUrls: [], _id: Math.random().toString(36).slice(2) });

const cellSel = { background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text)', padding: '0.4rem 0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', width: '100%' };

export default function AdminBulkUpload() {
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);
  const [loading, setLoading] = useState(false);

  const updateRow = (id, key, val) => setRows(prev => prev.map(r => r._id === id ? { ...r, [key]: val } : r));
  const addRow = () => setRows(prev => [...prev, emptyRow()]);
  const removeRow = (id) => setRows(prev => prev.filter(r => r._id !== id));

  const handleImages = (id, files) => {
    const fileArr = Array.from(files);
    setRows(prev => prev.map(r => r._id === id ? { ...r, images: fileArr, previewUrls: fileArr.map(f => URL.createObjectURL(f)) } : r));
  };

  const handleSubmit = async () => {
    const valid = rows.filter(r => r.price && r.rank && r.region);
    if (valid.length === 0) return toast.error('Fill in at least one complete row');
    setLoading(true);
    let created = 0, failed = 0;
    try {
      const withImages = valid.filter(r => r.images.length > 0);
      const withoutImages = valid.filter(r => r.images.length === 0);
      if (withoutImages.length > 0) {
        const res = await bulkCreateAccounts({ accounts: withoutImages.map(r => ({ rank: r.rank, rankTier: r.rankTier, region: r.region, price: Number(r.price), skinCount: Number(r.skinCount) || 0, level: Number(r.level) || 1, description: r.description })) });
        created += res.data.created;
      }
      for (const row of withImages) {
        try {
          const fd = new FormData();
          fd.append('rank', row.rank); fd.append('rankTier', row.rankTier); fd.append('region', row.region);
          fd.append('price', row.price); fd.append('skinCount', row.skinCount || 0); fd.append('level', row.level || 1); fd.append('description', row.description || '');
          row.images.forEach(img => fd.append('images', img));
          await createAccount(fd); created++;
        } catch { failed++; }
      }
      toast.success(`✅ ${created} accounts created${failed ? `, ${failed} failed` : ''}`);
      setRows([emptyRow(), emptyRow(), emptyRow()]);
    } catch { toast.error('Bulk upload failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="font-display text-3xl font-bold tracking-[2px]">
          Bulk <span style={{ color: 'var(--blue)' }}>Upload</span>
        </h2>
        <div className="flex gap-3">
          <button onClick={addRow} className="btn-outline flex items-center gap-2" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
            <RiAddLine /> Add Row
          </button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><RiLoader4Line size={16} /> Uploading...</> : <><RiUpload2Line size={16} /> Upload All</>}
          </button>
        </div>
      </div>

      <p className="font-mono mb-6" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        // Fill in the table below. Account IDs are assigned automatically.
      </p>

      <div className="overflow-x-auto">
        <div className="border min-w-[800px]" style={{ background: 'var(--bg3)', borderColor: 'var(--border-subtle)' }}>
          {/* Header */}
          <div className="grid border-b-2" style={{
            gridTemplateColumns: '80px 110px 60px 80px 80px 70px 70px 90px 1fr 40px',
            background: 'var(--bg2)', borderColor: 'rgba(59,158,255,0.2)',
          }}>
            {['ACCT ID', 'RANK', 'TIER', 'REGION', 'PRICE $', 'SKINS', 'LEVEL', 'IMAGES', 'DESCRIPTION', ''].map((h, i) => (
              <div key={i} className="px-3 py-3 font-display text-xs tracking-[2px] border-r last:border-r-0"
                style={{ color: 'var(--blue)', borderColor: 'rgba(255,255,255,0.04)' }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, rowIdx) => (
            <motion.div key={row._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: rowIdx * 0.04 }}
              className="grid border-b transition-colors duration-150"
              style={{
                gridTemplateColumns: '80px 110px 60px 80px 80px 70px 70px 90px 1fr 40px',
                borderColor: 'rgba(255,255,255,0.04)',
                background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,158,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
            >
              {/* Auto ID */}
              <div className="px-3 py-2 flex items-center border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>VAL-{String(rowIdx + 1).padStart(4, '0')}</span>
              </div>
              <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <select value={row.rank} onChange={e => updateRow(row._id, 'rank', e.target.value)} style={cellSel}>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <select value={row.rankTier} onChange={e => updateRow(row._id, 'rankTier', e.target.value)} style={cellSel}>
                  {['1','2','3'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <select value={row.region} onChange={e => updateRow(row._id, 'region', e.target.value)} style={cellSel}>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <input type="number" placeholder="0" value={row.price} onChange={e => updateRow(row._id, 'price', e.target.value)} style={cellSel} />
              </div>
              <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <input type="number" placeholder="0" value={row.skinCount} onChange={e => updateRow(row._id, 'skinCount', e.target.value)} style={cellSel} />
              </div>
              <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <input type="number" placeholder="1" value={row.level} onChange={e => updateRow(row._id, 'level', e.target.value)} style={cellSel} />
              </div>
              {/* Image upload */}
              <div className="border-r flex items-center justify-center p-1" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <label className="cursor-pointer flex flex-col items-center gap-0.5">
                  <input type="file" multiple accept="image/*" onChange={e => handleImages(row._id, e.target.files)} className="hidden" />
                  {row.previewUrls.length > 0 ? (
                    <div className="flex gap-0.5">
                      {row.previewUrls.slice(0, 3).map((url, i) => (
                        <img key={i} src={url} alt="" className="object-cover border" style={{ width: 22, height: 22, borderColor: 'rgba(59,158,255,0.4)' }} />
                      ))}
                    </div>
                  ) : <RiImageLine size={18} style={{ color: 'rgba(59,158,255,0.5)' }} />}
                  <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                    {row.images.length > 0 ? `${row.images.length} file${row.images.length > 1 ? 's' : ''}` : 'upload'}
                  </span>
                </label>
              </div>
              <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <input type="text" placeholder="Optional notes..." value={row.description} onChange={e => updateRow(row._id, 'description', e.target.value)} style={cellSel} />
              </div>
              <div className="flex items-center justify-center">
                <button onClick={() => removeRow(row._id)} className="bg-transparent p-1 transition-colors duration-200"
                  style={{ color: 'rgba(59,158,255,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(59,158,255,0.4)'}>
                  <RiDeleteBinLine size={15} />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add row */}
          <div onClick={addRow} className="flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors duration-200 border-t font-display text-sm tracking-wide"
            style={{ borderColor: 'rgba(255,255,255,0.04)', color: 'var(--text-dim)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}>
            <RiAddLine /> Add Row
          </div>
        </div>
      </div>
    </div>
  );
}
