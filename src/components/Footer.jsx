import { Link } from 'react-router-dom';
import { RiWhatsappLine, RiInstagramLine,  } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ background: 'var(--bg2)', borderColor: 'var(--border-subtle)', padding: '3rem 2rem 2rem' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>

          <div>
            <div className="font-display text-xl font-bold tracking-[3px] mb-3">
              Joyner Valorant <span style={{ color: 'var(--blue)' }}>Store</span>
            </div>
            <p className="text-sm leading-7" style={{ color: 'var(--text-muted)' }}>
              Premium Valorant accounts. Verified, safe & instant delivery.
            </p>
          </div>

          <div>
            <div className="font-display font-bold tracking-[2px] uppercase mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>Navigate</div>
            {[['/', 'Home'], ['/accounts', 'Browse Accounts']].map(([path, label]) => (
              <div key={path} className="mb-2">
                <Link to={path} className="text-sm transition-colors duration-200"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--blue)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{label}</Link>
              </div>
            ))}
          </div>

          <div>
  <div className="font-display font-bold tracking-[2px] uppercase mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>Contact</div>
  <div className="flex gap-3">
    {[
      { Icon: RiWhatsappLine, url: 'https://wa.me/1234567890' },
      { Icon: RiInstagramLine, url: 'https://instagram.com/yourpage' },
    ].map(({ Icon, url }, i) => (
      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
        <div
          className="w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{
            background: 'var(--bg4)',
            border: '1px solid var(--border-subtle)',
            clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
            color: 'var(--text-muted)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.borderColor = 'var(--blue)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <Icon size={16} />
        </div>
      </a>
    ))}
  </div>
</div>
        </div>

        <div className="pt-6 flex justify-between items-center flex-wrap gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
            © 2025 Joyner Valorant Store. Not affiliated with Riot Games.
          </span>
          <Link to="/admin/login" className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>Admin</Link>
        </div>
      </div>
    </footer>
  );
}
