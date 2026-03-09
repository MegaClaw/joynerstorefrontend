import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { bulkCreateAccounts, createAccount } from '../../utils/api';
import { RiUpload2Line, RiLoader4Line, RiDeleteBinLine, RiImageAddLine, RiCheckLine } from 'react-icons/ri';

const RANKS = ['Iron','Bronze','Silver','Gold','Platinum','Diamond','Ascendant','Immortal','Radiant'];
const REGIONS = ['NA','EU','AP','KR','BR','LATAM','TR','ME'];

const emptyRowFromFile = (file) => ({
  _id: Math.random().toString(36).slice(2),
  image: file,
  previewUrl: URL.createObjectURL(file),
  rank: 'Gold',
  rankTier: '1',
  region: 'NA',
  price: '',
  skinCount: '',
  level: '',
  description: '',
});

const cellSel = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  color: 'var(--text)',
  padding: '0.35rem 0.4rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  outline: 'none',
  width: '100%',
};

export default function AdminBulkUpload() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const fileInputRef = useRef();

  const addFiles = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return toast.error('Please select image files only');
    const newRows = imageFiles.map(emptyRowFromFile);
    setRows(prev => [...prev, ...newRows]);
    toast.success(`${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} added`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const updateRow = (id, key, val) =>
    setRows(prev => prev.map(r => r._id === id ? { ...r, [key]: val } : r));

  const removeRow = (id) =>
    setRows(prev => prev.filter(r => r._id !== id));

  const handleSubmit = async () => {
    const valid = rows.filter(r => r.price && r.rank && r.region);
    if (valid.length === 0) return toast.error('Fill in at least price, rank and region for each row');
    setLoading(true);
    let created = 0, failed = 0;
    try {
      for (const row of valid) {
        try {
          const fd = new FormData();
          fd.append('rank', row.rank);
          fd.append('rankTier', row.rankTier);
          fd.append('region', row.region);
          fd.append('price', row.price);
          fd.append('skinCount', row.skinCount || 0);
          fd.append('level', row.level || 1);
          fd.append('description', row.description || '');
          fd.append('images', row.image);
          await createAccount(fd);
          created++;
        } catch { failed++; }
      }
      toast.success(`✅ ${created} accounts created${failed ? `, ${failed} failed` : ''}`);
      setRows([]);
    } catch {
      toast.error('Bulk upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="font-display text-3xl font-bold tracking-[2px]">
          Bulk <span style={{ color: 'var(--blue)' }}>Upload</span>
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn-outline flex items-center gap-2"
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
          >
            <RiImageAddLine /> Add Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => addFiles(e.target.files)}
          />
          {rows.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? <><RiLoader4Line size={16} /> Uploading...</>
                : <><RiUpload2Line size={16} /> Upload All ({rows.length})</>
              }
            </button>
          )}
        </div>
      </div>

      <p className="font-mono mb-6" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
        // Drop images below — each image becomes a row. Fill in details, then upload all.
      </p>

      {/* Drop Zone */}
      {rows.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer flex flex-col items-center justify-center gap-4 border-2 border-dashed transition-all duration-200"
          style={{
            minHeight: 280,
            borderColor: dragOver ? 'var(--blue)' : 'rgba(59,158,255,0.25)',
            background: dragOver ? 'rgba(59,158,255,0.05)' : 'var(--bg3)',
            borderRadius: 4,
          }}
        >
          <RiImageAddLine size={48} style={{ color: dragOver ? 'var(--blue)' : 'rgba(59,158,255,0.35)' }} />
          <div className="text-center">
            <p className="font-display tracking-widest text-sm" style={{ color: 'var(--blue)' }}>
              DROP IMAGES HERE
            </p>
            <p className="font-mono mt-1" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              or click to browse — select 1 to 100+ images at once
            </p>
          </div>
        </motion.div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <>
          {/* Small drop zone when rows exist */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer flex items-center justify-center gap-2 border border-dashed mb-4 py-2 transition-all duration-200"
            style={{
              borderColor: dragOver ? 'var(--blue)' : 'rgba(59,158,255,0.2)',
              background: dragOver ? 'rgba(59,158,255,0.05)' : 'transparent',
              borderRadius: 4,
              color: 'var(--text-dim)',
              fontSize: '0.78rem',
            }}
          >
            <RiImageAddLine size={14} /> Drop more images or click to add
          </div>

          <div className="overflow-x-auto">
            <div className="border min-w-[900px]" style={{ background: 'var(--bg3)', borderColor: 'var(--border-subtle)' }}>
              {/* Header */}
              <div
                className="grid border-b-2"
                style={{
                  gridTemplateColumns: '140px 110px 60px 80px 80px 65px 65px 1fr 36px',
                  background: 'var(--bg2)',
                  borderColor: 'rgba(59,158,255,0.2)',
                }}
              >
                {['IMAGE', 'RANK', 'TIER', 'REGION', 'PRICE $', 'SKINS', 'LEVEL', 'DESCRIPTION', ''].map((h, i) => (
                  <div
                    key={i}
                    className="px-3 py-3 font-display text-xs tracking-[2px] border-r last:border-r-0"
                    style={{ color: 'var(--blue)', borderColor: 'rgba(255,255,255,0.04)' }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <AnimatePresence>
                {rows.map((row, rowIdx) => (
                  <motion.div
                    key={row._id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ delay: Math.min(rowIdx * 0.03, 0.3) }}
                    className="grid border-b"
                    style={{
                      gridTemplateColumns: '140px 110px 60px 80px 80px 65px 65px 1fr 36px',
                      borderColor: 'rgba(255,255,255,0.04)',
                      background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                      alignItems: 'center',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,158,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                  >
                    {/* Image preview — large & clickable */}
                    <div
                      className="border-r flex items-center justify-center p-2 cursor-pointer"
                      style={{ borderColor: 'rgba(255,255,255,0.04)', height: 90 }}
                      onClick={() => setLightbox(row.previewUrl)}
                      title="Click to enlarge"
                    >
                      <img
                        src={row.previewUrl}
                        alt=""
                        className="object-cover border transition-transform duration-150 hover:scale-105"
                        style={{
                          width: 118,
                          height: 74,
                          borderColor: 'rgba(59,158,255,0.3)',
                          borderRadius: 2,
                        }}
                      />
                    </div>

                    {/* Rank */}
                    <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <select value={row.rank} onChange={e => updateRow(row._id, 'rank', e.target.value)} style={cellSel}>
                        {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    {/* Tier */}
                    <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <select value={row.rankTier} onChange={e => updateRow(row._id, 'rankTier', e.target.value)} style={cellSel}>
                        {['1','2','3'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    {/* Region */}
                    <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <select value={row.region} onChange={e => updateRow(row._id, 'region', e.target.value)} style={cellSel}>
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    {/* Price */}
                    <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <input type="number" placeholder="0" value={row.price} onChange={e => updateRow(row._id, 'price', e.target.value)} style={cellSel} />
                    </div>
                    {/* Skins */}
                    <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <input type="number" placeholder="0" value={row.skinCount} onChange={e => updateRow(row._id, 'skinCount', e.target.value)} style={cellSel} />
                    </div>
                    {/* Level */}
                    <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <input type="number" placeholder="1" value={row.level} onChange={e => updateRow(row._id, 'level', e.target.value)} style={cellSel} />
                    </div>
                    {/* Description */}
                    <div className="border-r" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <input type="text" placeholder="Optional notes..." value={row.description} onChange={e => updateRow(row._id, 'description', e.target.value)} style={cellSel} />
                    </div>
                    {/* Delete */}
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => removeRow(row._id)}
                        className="bg-transparent p-1 transition-colors duration-200"
                        style={{ color: 'rgba(59,158,255,0.4)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ff4d4d'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(59,158,255,0.4)'}
                      >
                        <RiDeleteBinLine size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Footer summary */}
              <div
                className="flex items-center justify-between px-4 py-3 border-t font-mono"
                style={{ borderColor: 'rgba(255,255,255,0.04)', fontSize: '0.75rem', color: 'var(--text-dim)' }}
              >
                <span>{rows.length} image{rows.length !== 1 ? 's' : ''} ready</span>
                <span style={{ color: rows.filter(r => r.price).length === rows.length ? 'var(--blue)' : 'var(--text-dim)' }}>
                  {rows.filter(r => r.price).length}/{rows.length} priced
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              src={lightbox}
              alt="Preview"
              className="max-w-[90vw] max-h-[85vh] object-contain border-2"
              style={{ borderColor: 'rgba(59,158,255,0.4)', borderRadius: 4 }}
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute top-6 right-8 font-display text-2xl"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onClick={() => setLightbox(null)}
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}