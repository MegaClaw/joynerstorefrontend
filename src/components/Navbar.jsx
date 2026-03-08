import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-8 ${
      scrolled ? 'bg-bg2/95 backdrop-blur-md border-b border-primary/20' : 'bg-transparent border-b border-transparent'
    }`} style={{ background: scrolled ? 'rgba(13,17,23,0.95)' : 'transparent' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[70px]">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-modified.png" alt="JoynerStore" className="w-11 h-11 object-fill rounded-full contrast-125" />
          <span className="font-display text-xl font-bold tracking-[3px] uppercase text-white">
            Joyner Valorant <span className="text-primary">Store</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {[['/', 'Home'], ['/accounts', 'Browse Accounts']].map(([path, label]) => (
            <Link key={path} to={path} className="relative font-display text-sm font-semibold tracking-[2px] uppercase transition-colors duration-200"
              style={{ color: location.pathname === path ? 'var(--blue)' : 'var(--text-muted)' }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = location.pathname === path ? 'var(--blue)' : 'var(--text-muted)'}
            >
              {label}
              {location.pathname === path && (
                <motion.div layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          ))}
          <Link to="/accounts">
            <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>
              Buy Now
            </button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden bg-transparent text-white text-2xl">
          {menuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden flex flex-col gap-6 px-8 py-6 border-t"
            style={{ background: 'rgba(13,17,23,0.98)', borderColor: 'rgba(59,158,255,0.2)' }}
          >
            <Link to="/" className="font-display tracking-[2px] uppercase" style={{ color: 'var(--text)' }}>Home</Link>
            <Link to="/accounts" className="font-display tracking-[2px] uppercase" style={{ color: 'var(--text)' }}>Browse Accounts</Link>
            <Link to="/accounts"><button className="btn-primary">Buy Now</button></Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
