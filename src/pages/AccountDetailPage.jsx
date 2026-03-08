import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAccount, getWhatsAppLink } from '../utils/api';
import { RiWhatsappLine, RiMapPin2Line, RiShieldLine, RiUserLine, RiArrowLeftLine, RiLoader4Line, RiCheckLine } from 'react-icons/ri';

export default function AccountDetailPage() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getAccount(id).then(res => setAccount(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg1)' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <RiLoader4Line size={48} style={{ color: 'var(--blue)' }} />
      </motion.div>
    </div>
  );

  if (!account) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg1)' }}>
      <div className="text-center">
        <div className="font-display text-3xl mb-4">Account Not Found</div>
        <Link to="/accounts"><button className="btn-primary">Back to Listings</button></Link>
      </div>
    </div>
  );

  const { accountId, rank, rankTier, region, price, skins, skinCount, level, agentCount, images, description, highlights, isSold } = account;
  const whatsappLink = getWhatsAppLink(accountId, `${rank} ${rankTier}`);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg1)' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-16 flex-1 w-full">

        {/* Breadcrumb */}
        <Link to="/accounts" className="inline-flex items-center gap-2 mb-8 font-display text-sm tracking-wide uppercase transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <RiArrowLeftLine /> Back to Accounts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT: Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card-clip overflow-hidden mb-3 relative border" style={{ aspectRatio: '16/9', background: 'var(--bg2)', borderColor: 'var(--border-subtle)', cursor: 'zoom-in' }} onClick={() => images?.[activeImg]?.url && setLightbox(images[activeImg].url)}>
              {images?.[activeImg]?.url ? (
                <img src={images[activeImg].url} alt={rank} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-dim)' }}>No Image</div>
              )}
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(8,12,18,0.85)' }}>
                  <span className="font-display text-4xl font-bold border-4 px-6 py-2"
                    style={{ color: 'var(--text-dim)', borderColor: 'var(--text-dim)', transform: 'rotate(-20deg)' }}>SOLD</span>
                </div>
              )}
            </div>
            {images?.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} className="cursor-pointer overflow-hidden border-2 transition-colors"
                    style={{ width: 70, height: 50, borderColor: activeImg === i ? 'var(--blue)' : 'var(--border-subtle)' }}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="font-mono mb-1" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {accountId}</div>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className={`rank-badge rank-${rank}`} style={{ fontSize: '1rem', padding: '0.3rem 1rem' }}>{rank} {rankTier}</span>
              <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                <RiMapPin2Line /> {region}
              </span>
            </div>

            <div className="font-display font-bold mb-6" style={{ fontSize: '3rem', color: 'var(--blue)', lineHeight: 1 }}>₹{price}</div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-px mb-6 border" style={{ background: 'var(--border-subtle)', borderColor: 'var(--border-subtle)' }}>
              {[[RiShieldLine, 'Skins', skinCount || skins?.length || 0], [RiUserLine, 'Level', level], [RiUserLine, 'Agents', agentCount]].map(([Icon, label, val]) => (
                <div key={label} className="text-center py-4" style={{ background: 'var(--bg3)' }}>
                  <div className="font-display font-bold text-2xl text-white">{val}</div>
                  <div className="font-mono tracking-wide uppercase mt-1" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{label}</div>
                </div>
              ))}
            </div>

            {description && <p className="leading-7 mb-6" style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{description}</p>}

            {highlights?.length > 0 && (
              <div className="mb-6">
                <div className="admin-label">Highlights</div>
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1 text-base" style={{ color: 'var(--text)' }}>
                    <RiCheckLine style={{ color: 'var(--blue)' }} /> {h}
                  </div>
                ))}
              </div>
            )}

            {skins?.length > 0 && (
              <div className="mb-8">
                <div className="admin-label">Notable Skins</div>
                <div className="flex flex-wrap gap-2">
                  {skins.map((skin, i) => (
                    <span key={i} className="text-sm px-3 py-1 border"
                      style={{ background: 'var(--bg4)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)',
                        clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)' }}>
                      {skin}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buy button */}
            {!isSold ? (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <button className="w-full flex items-center justify-center gap-3 font-display font-bold text-lg tracking-[2px] uppercase text-white transition-all duration-200"
                  style={{ background: '#25D366', padding: '1rem 2rem',
                    clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                    boxShadow: '0 0 30px rgba(37,211,102,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(37,211,102,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(37,211,102,0.3)'}
                >
                  <RiWhatsappLine size={22} /> Contact to Buy
                </button>
              </a>
            ) : (
              <button disabled className="w-full font-display font-bold text-lg tracking-[2px] uppercase border"
                style={{ background: 'var(--bg4)', color: 'var(--text-dim)', borderColor: 'var(--border-subtle)', padding: '1rem',
                  clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)', cursor: 'not-allowed' }}>
                Already Sold
              </button>
            )}
            <p className="text-center mt-3" style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
              You'll be redirected to WhatsApp to complete your purchase
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'zoom-out', padding: '2rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <img src={lightbox} alt="Full view" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', border: '1px solid rgba(59,158,255,0.3)' }} />
            <button onClick={() => setLightbox(null)} style={{
              position: 'absolute', top: -16, right: -16,
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--blue)', color: 'white',
              border: 'none', fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
            }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
