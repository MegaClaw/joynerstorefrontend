import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountCard from "../components/AccountCard";
import { getAccounts } from "../utils/api";
import {
  RiShieldCheckLine,
  RiFlashlightLine,
  RiCustomerService2Line,
  RiArrowRightLine,
} from "react-icons/ri";

const RANKS = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Ascendant",
  "Immortal",
  "Radiant",
];
const features = [
  {
    icon: RiShieldCheckLine,
    title: "Verified Accounts",
    desc: "Every account is manually verified before listing. No bans, no issues guaranteed.",
  },
  {
    icon: RiFlashlightLine,
    title: "Instant Delivery",
    desc: "Get your account credentials via WhatsApp within minutes of payment.",
  },
  {
    icon: RiCustomerService2Line,
    title: "24/7 Support",
    desc: "Our team is always online to help you with any questions or concerns.",
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    getAccounts({ limit: 3, sort: "price_desc" })
      .then((res) => setFeatured(res.data.accounts))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current)
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg1)" }}
    >
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Video background */}
        <video
  autoPlay
  loop
  muted
  playsInline
  preload="none"
  ref={el => { if (el) el.addEventListener('pause', () => el.play()); }}
  className="absolute inset-0 w-full h-full object-cover"
  style={{ opacity: 0.25, zIndex: 0 }}
>
  <source src="/hero-bg.mp4" type="video/mp4" />
</video>

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,12,18,0.75) 0%, rgba(8,12,18,0.45) 50%, rgba(8,12,18,0.75) 100%)",
            zIndex: 1,
          }}
        />

        {/* Grid overlay */}
        <div
          className="grid-bg absolute inset-0 opacity-30"
          style={{ zIndex: 1 }}
        />

        {/* Corner energy beams */}
        <div
          className="absolute top-0 left-0 w-64 h-px"
          style={{
            background:
              "linear-gradient(to right, rgba(59,158,255,0.8), transparent)",
            zIndex: 2,
            animation: "beamGrow 2s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute top-0 left-0 w-px h-64"
          style={{
            background:
              "linear-gradient(to bottom, rgba(59,158,255,0.8), transparent)",
            zIndex: 2,
            animation: "beamGrow 2s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-px"
          style={{
            background:
              "linear-gradient(to left, rgba(59,158,255,0.8), transparent)",
            zIndex: 2,
            animation: "beamGrow 2s ease-in-out infinite alternate 1s",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-px h-64"
          style={{
            background:
              "linear-gradient(to top, rgba(59,158,255,0.8), transparent)",
            zIndex: 2,
            animation: "beamGrow 2s ease-in-out infinite alternate 1s",
          }}
        />

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px animate-scan"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(59,158,255,0.5), transparent)",
            zIndex: 2,
          }}
        />

        {/* Corner decorations */}
        <div
          className="absolute top-20 left-0 w-10 h-10 border-t-2 border-l-2"
          style={{ borderColor: "var(--blue)" }}
        />
        <div
          className="absolute top-20 right-0 w-10 h-10 border-t-2 border-r-2"
          style={{ borderColor: "var(--blue)" }}
        />
        <div
          className="absolute bottom-10 left-0 w-10 h-10 border-b-2 border-l-2"
          style={{ borderColor: "rgba(59,158,255,0.3)" }}
        />
        <div
          className="absolute bottom-10 right-0 w-10 h-10 border-b-2 border-r-2"
          style={{ borderColor: "rgba(59,158,255,0.3)" }}
        />

        <div className="max-w-7xl mx-auto px-8 relative z-20 pt-28 pb-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="section-label"style={{ color: "#60b8ff", opacity: 1 }}>
                Joyner Valorant Store — Premium Accounts
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="font-display font-bold mb-6"
              style={{
                fontSize: "clamp(3rem, 7vw, 6rem)",
                lineHeight: 1.0,
                letterSpacing: "-1px",
                color: "white",
              }}
            >
              DOMINATE
              <br />
              <span className="relative" style={{ color: "var(--blue)" }}>
                THE LEADERBOARD
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
                  style={{ background: "var(--blue)" }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-xl mb-10 leading-8 max-w-lg"
              style={{ color: "#c0d0e0" }}
            >
              {" "}
              Buy a premium Valorant account with your desired rank, rare skins
              & more verified, safe, and delivered instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex gap-4 flex-wrap"
            >
              <Link to="/accounts">
                <button
                  className="btn-primary"
                  style={{ fontSize: "1rem", padding: "0.9rem 2.5rem" }}
                >
                  Browse Accounts
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-12 mt-16 flex-wrap"
            >
              {[
                ["500+", "Accounts Sold"],
                ["100%", "Verified"],
                ["24/7", "Support"],
              ].map(([num, label]) => (
                <div key={label}>
                  <div
                    className="font-display font-bold"
                    style={{
                      fontSize: "2.2rem",
                      color: "#60b8ff",
                      lineHeight: 1,
                      textShadow: "0 0 20px rgba(59,158,255,0.8)",
                    }}
                  >
                    {num}
                  </div>
                  <div
                    className="font-mono tracking-[2px] uppercase mt-1"
                    style={{ fontSize: "0.7rem", color: "#7a9ab5" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Floating rank list */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 flex-col gap-2 hidden lg:flex" style={{ zIndex: 10, opacity: 1 }}>
          {RANKS.slice()
            .reverse()
            .map((rank, i) => (
              <motion.div
                key={rank}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                <span
  className={`rank-badge rank-${rank}`}
  style={{
    fontSize: "0.7rem",
    filter: "brightness(2) saturate(1.5)",
    boxShadow: "0 0 12px currentColor",
  }}
>
  {rank}
</span>
              </motion.div>
            ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24" style={{ background: "var(--bg2)" }}>
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="section-label justify-center">Why Choose Us</div>
            <h2 className="section-title">
              The Safest Way to{" "}
              <span style={{ color: "var(--blue)" }}>Rank Up</span>
            </h2>
          </motion.div>

          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-clip p-8 border transition-all duration-200"
                style={{
                  background: "var(--bg3)",
                  borderColor: "var(--border-subtle)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(59,158,255,0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border-subtle)")
                }
              >
                <div
                  className="w-12 h-12 flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(59,158,255,0.1)",
                    border: "1px solid rgba(59,158,255,0.3)",
                    clipPath:
                      "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  }}
                >
                  <Icon size={22} style={{ color: "var(--blue)" }} />
                </div>
                <h3 className="font-display text-xl font-bold tracking-wide mb-2">
                  {title}
                </h3>
                <p
                  className="leading-7"
                  style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ACCOUNTS */}
      {featured.length > 0 && (
        <section className="py-24" style={{ background: "var(--bg1)" }}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
              <div>
                <div className="section-label">Hot Listings</div>
                <h2 className="section-title">
                  Featured{" "}
                  <span style={{ color: "var(--blue)" }}>Accounts</span>
                </h2>
              </div>
              <Link
                to="/accounts"
                className="flex items-center gap-2 font-display tracking-[2px] text-sm uppercase transition-colors"
                style={{ color: "var(--blue)" }}
              >
                View All <RiArrowRightLine />
              </Link>
            </div>
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {featured.map((acc) => (
                <AccountCard key={acc._id} account={acc} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section
        className="py-20 border-y text-center"
        style={{
          background:
            "linear-gradient(135deg, var(--bg2) 0%, rgba(59,158,255,0.08) 100%)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="section-title mb-4">
            Ready to <span style={{ color: "var(--blue)" }}>Climb?</span>
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            Browse all available accounts and find your perfect rank.
          </p>
          <Link to="/accounts">
            <button
              className="btn-primary"
              style={{ fontSize: "1.1rem", padding: "1rem 3rem" }}
            >
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
