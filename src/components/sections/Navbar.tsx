"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { smoothScrollTo } from "@/lib/scroll";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "about" },
    { label: "Services", href: "services" },
    { label: "Pricing", href: "pricing" },
    { label: "Locations", href: "locations" },
    { label: "FAQ", href: "faq" },
  ];

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    smoothScrollTo(targetId);
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0C0C0C]/90 backdrop-blur-md md:backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Image src="/logo-icon-green.png" alt="Coach Luki" width={32} height={32} className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-display)]">
            <span className="gradient-text">COACH</span>{" "}
            <span className="text-white">LUKI</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 tracking-wide uppercase cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={(e) => handleNavClick(e, "contact")}
            className="bg-accent text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-accent-light hover:shadow-[0_0_30px_rgba(0,102,51,0.3)] transition-all duration-300 cursor-pointer"
          >
            Apply Now
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white"
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0C0C0C]/98 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <button
                  key={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg text-zinc-300 hover:text-white transition-colors py-2 text-left cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={(e) => handleNavClick(e, "contact")}
                className="bg-accent text-white px-5 py-3 rounded-full text-center font-semibold mt-2 cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
