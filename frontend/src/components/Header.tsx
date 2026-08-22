"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Shield, PhoneCall } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Why Us", href: "#why-us" },
    { name: "Journey", href: "#journey" },
    { name: "Courses", href: "#courses" },
    { name: "Faculty", href: "#faculty" },
    { name: "Training", href: "#training" },
    { name: "Success Stories", href: "#success" },
    { name: "Blogs", href: "#blogs" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0B132B]/90 backdrop-blur-md border-b border-accent/20 py-4 shadow-lg"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-6 h-6 text-[#0B132B]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-bold font-display tracking-widest text-white uppercase group-hover:text-accent transition-colors duration-300">
              Dehradun Defence
            </span>
            <span className="text-[10px] text-gray-400 tracking-wider font-light uppercase">
              Academy
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-accent font-semibold transition-colors duration-300"
            >
              {l.name}
            </Link>
          ))}
          <Link
            href="/admin"
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white font-semibold transition-colors duration-300 border-l border-white/20 pl-4"
          >
            Admin Panel
          </Link>
        </nav>

        {/* CTA BUTTON */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-300 hover:text-accent transition-colors font-semibold"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Officer</span>
          </a>
          <Link
            href="#contact"
            className="bg-accent hover:bg-accent-light text-[#0B132B] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Apply Now
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1 text-white hover:text-accent transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0B132B]/95 border-b border-accent/20 backdrop-blur-lg flex flex-col py-6 px-6 gap-4 shadow-xl animate-fade-in">
          {navLinks.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-gray-300 hover:text-accent font-semibold py-2 transition-colors border-b border-white/5"
            >
              {l.name}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-white font-semibold py-2 transition-colors border-b border-white/5"
          >
            Admin Panel
          </Link>
          <div className="flex flex-col sm:hidden gap-4 mt-2">
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-accent hover:bg-accent-light text-[#0B132B] text-center font-bold text-xs uppercase tracking-widest py-3 rounded transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
