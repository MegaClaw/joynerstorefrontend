import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiMapPin2Line, RiShieldLine, RiImageLine } from 'react-icons/ri';

export default function AccountCard({ account }) {
  const { _id, accountId, rank, rankTier, region, price, skinCount, images, isFeatured, isSold } = account;
  const img = images?.[0]?.url;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Link to={`/accounts/${_id}`}>
        <div className="card-clip border transition-all duration-200 overflow-hidden cursor-pointer"
          style={{ background: 'var(--bg3)', borderColor: 'var(--border-subtle)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,158,255,0.4)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,158,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {/* Image */}
          <div className="relative overflow-hidden" style={{ height: 200, background: 'var(--bg2)' }}>
            {img ? (
              <img src={img} alt={`${rank} account`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            ) : (
              <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-dim)' }}>
                <RiImageLine size={48} />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-2/3"
              style={{ background: 'linear-gradient(to top, var(--bg3), transparent)' }} />

            {/* Featured badge */}
            {isFeatured && (
              <div className="absolute top-3 left-3 font-display text-xs font-bold tracking-[2px] uppercase px-3 py-0.5"
                style={{ background: 'var(--gold)', color: '#000',
                  clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)' }}>
                ★ Featured
              </div>
            )}

            {/* Sold overlay */}
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(8,12,18,0.85)' }}>
                <span className="font-display text-2xl font-bold tracking-[4px] border-2 px-4 py-1"
                  style={{ color: 'var(--text-dim)', borderColor: 'var(--text-dim)', transform: 'rotate(-15deg)' }}>
                  SOLD
                </span>
              </div>
            )}

            {/* Account ID */}
            <div className="absolute bottom-2 left-3 font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {accountId}
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`rank-badge rank-${rank}`}>{rank} {rankTier}</span>
              <span className="font-display font-bold text-2xl" style={{ color: 'var(--blue)' }}>₹{price}</span>
            </div>
            <div className="flex gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><RiMapPin2Line size={13} />{region}</span>
              <span className="flex items-center gap-1"><RiShieldLine size={13} />{skinCount || 0} Skins</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
