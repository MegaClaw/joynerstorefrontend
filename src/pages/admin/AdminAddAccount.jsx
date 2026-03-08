import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createAccount, updateAccount, getAccount } from '../../utils/api';
import { RiAddLine, RiCloseLine, RiUpload2Line, RiLoader4Line } from 'react-icons/ri';

const RANKS = ['Iron','Bronze','Silver','Gold','Platinum','Diamond','Ascendant','Immortal','Radiant'];
const REGIONS = ['NA','EU','AP','KR','BR','LATAM','TR','ME'];

export default function AdminAddAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [skinInput, setSkinInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [form, setForm] = useState({
    rank: 'Gold', rankTier: '1', region: 'NA',
    price: '', skinCount: '', level: '', agentCount: '',
    description: '', skins: [], highlights: [], isFeatured: false, isSold: false,
  });

  useEffect(() => {
    if (isEdit) {
      getAccount(id).then(res => {
        const a = res.data;
        setForm({ rank: a.rank, rankTier: a.rankTier, region: a.region, price: a.price, skinCount: a.skinCount,
          level: a.level, agentCount: a.agentCount, description: a.description || '',
          skins: a.skins || [], highlights: a.highlights || [], isFeatured: a.isFeatured, isSold: a.isSold });
        setExistingImages(a.images || []);
      }).finally(() => setFetchLoading(false));
    }
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const addSkin = () => { if (skinInput.trim()) { setForm(f => ({ ...f, skins: [...f.skins, skinInput.trim()] })); setSkinInput(''); } };
  const addHighlight = () => { if (highlightInput.trim()) { setForm(f => ({ ...f, highlights: [...f.highlights, highlightInput.trim()] })); setHighlightInput(''); } };

  const handleSubmit = async () => {
    if (!form.price) return toast.error('Price is required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (Array.isArray(v)) fd.append(k, JSON.stringify(v)); else fd.append(k, v.toString()); });
      images.forEach(img => fd.append('images', img));
      if (removedImages.length) fd.append('removeImages', JSON.stringify(removedImages));
      if (isEdit) { await updateAccount(id, fd); toast.success('Account updated!'); }
      else { await createAccount(fd); toast.success('Account created!'); }
      navigate('/admin/accounts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setLoading(false); }
  };

  const Toggle = ({ field, label }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={() => setForm(f => ({ ...f, [field]: !f[field] }))}
        className="relative transition-colors duration-200 cursor-pointer"
        style={{ width: 40, height: 22, background: form[field] ? 'var(--blue)' : 'var(--bg4)', border: '1px solid var(--border-subtle)', borderRadius: 11 }}>
        <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200"
          style={{ left: form[field] ? 20 : 2 }} />
      </div>
      <span className="font-display text-sm tracking-wide">{label}</span>
    </label>
  );

  if (fetchLoading) return (
    <div className="flex justify-center py-20" style={{ color: 'var(--blue)' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RiLoader4Line size={40} /></motion.div>
    </div>
  );

  return (
    <div>
      <h2 className="font-display text-3xl font-bold tracking-[2px] mb-8">
        {isEdit ? 'Edit' : 'Add'} <span style={{ color: 'var(--blue)' }}>Account</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {/* Rank */}
        <div><label className="admin-label">Rank</label>
          <select value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))} className="admin-input">
            {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
          </select></div>
        <div><label className="admin-label">Rank Tier</label>
          <select value={form.rankTier} onChange={e => setForm(f => ({ ...f, rankTier: e.target.value }))} className="admin-input">
            {['1','2','3'].map(t => <option key={t} value={t}>{t}</option>)}
          </select></div>
        <div><label className="admin-label">Region</label>
          <select value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className="admin-input">
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select></div>
        <div><label className="admin-label">Price ($)</label>
          <input type="number" placeholder="49" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="admin-input" /></div>
        <div><label className="admin-label">Account Level</label>
          <input type="number" placeholder="100" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="admin-input" /></div>
        <div><label className="admin-label">Agent Count</label>
          <input type="number" placeholder="18" value={form.agentCount} onChange={e => setForm(f => ({ ...f, agentCount: e.target.value }))} className="admin-input" /></div>
        <div><label className="admin-label">Skin Count</label>
          <input type="number" placeholder="25" value={form.skinCount} onChange={e => setForm(f => ({ ...f, skinCount: e.target.value }))} className="admin-input" /></div>
        <div className="flex items-center gap-8 pt-6">
          <Toggle field="isFeatured" label="Featured" />
          <Toggle field="isSold" label="Sold" />
        </div>

        {/* Description */}
        <div className="md:col-span-2"><label className="admin-label">Description</label>
          <textarea placeholder="Account description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="admin-input resize-y" /></div>

        {/* Skins */}
        <div className="md:col-span-2">
          <label className="admin-label">Notable Skins</label>
          <div className="flex gap-2 mb-3">
            <input placeholder="e.g. Reaver Vandal" value={skinInput} onChange={e => setSkinInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkin()} className="admin-input flex-1" />
            <button onClick={addSkin} className="btn-primary px-4"><RiAddLine /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skins.map((s, i) => (
              <span key={i} className="flex items-center gap-2 text-sm px-3 py-1 border"
                style={{ background: 'var(--bg4)', borderColor: 'var(--border-subtle)' }}>
                {s} <RiCloseLine size={12} className="cursor-pointer" style={{ color: 'var(--blue)' }}
                  onClick={() => setForm(f => ({ ...f, skins: f.skins.filter((_, idx) => idx !== i) }))} />
              </span>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="md:col-span-2">
          <label className="admin-label">Highlights</label>
          <div className="flex gap-2 mb-3">
            <input placeholder="e.g. Rare battlepass skin" value={highlightInput} onChange={e => setHighlightInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHighlight()} className="admin-input flex-1" />
            <button onClick={addHighlight} className="btn-primary px-4"><RiAddLine /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.highlights.map((h, i) => (
              <span key={i} className="flex items-center gap-2 text-sm px-3 py-1 border"
                style={{ background: 'rgba(59,158,255,0.08)', borderColor: 'rgba(59,158,255,0.2)', color: 'var(--blue)' }}>
                {h} <RiCloseLine size={12} className="cursor-pointer"
                  onClick={() => setForm(f => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }))} />
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="admin-label">Account Screenshots</label>
          {existingImages.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {existingImages.map(img => (
                <div key={img.publicId} className="relative" style={{ width: 90, height: 60 }}>
                  <img src={img.url} alt="" className="w-full h-full object-cover border" style={{ borderColor: 'var(--border-subtle)' }} />
                  <button onClick={() => { setExistingImages(p => p.filter(x => x.publicId !== img.publicId)); setRemovedImages(p => [...p, img.publicId]); }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ background: 'var(--blue)', fontSize: 10 }}><RiCloseLine /></button>
                </div>
              ))}
            </div>
          )}
          <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed cursor-pointer transition-all duration-200"
            style={{ borderColor: 'rgba(59,158,255,0.3)', background: 'rgba(59,158,255,0.03)', color: 'var(--text-dim)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,158,255,0.6)'; e.currentTarget.style.background = 'rgba(59,158,255,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,158,255,0.3)'; e.currentTarget.style.background = 'rgba(59,158,255,0.03)'; }}>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            <RiUpload2Line size={24} className="mb-1" />
            <span className="text-sm">Click to upload images</span>
          </label>
          {previewUrls.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative" style={{ width: 90, height: 60 }}>
                  <img src={url} alt="" className="w-full h-full object-cover border" style={{ borderColor: 'rgba(59,158,255,0.3)' }} />
                  <button onClick={() => { setImages(p => p.filter((_, idx) => idx !== i)); setPreviewUrls(p => p.filter((_, idx) => idx !== i)); }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ background: 'var(--blue)', fontSize: 10 }}><RiCloseLine /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ padding: '0.9rem 2.5rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Saving...' : isEdit ? 'Update Account' : 'Create Account'}
        </button>
        <button onClick={() => navigate('/admin/accounts')} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}
