"use client";

import React from "react";
import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050914] text-white border-t border-white/5 pt-16 pb-8 overflow-hidden relative">
      {/* Dynamic background light flares */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#4B6F44]/5 to-transparent filter blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#D4AF37]/5 to-transparent filter blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        
        {/* COL 1: Brand & Slogan */}
        <div className="flex flex-col gap-6">
          <Link href="#" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Shield className="w-6 h-6 text-[#0B132B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-display tracking-widest text-white uppercase">
                Doon Defence
              </span>
              <span className="text-[10px] text-gray-400 tracking-wider font-light uppercase">
                College & Academy
              </span>
            </div>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            India's most premium Defence coaching institute, grooming patriotic students into commissioned officers of the Indian Army, Navy, and Air Force.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-white/10 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-white/10 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-white/10 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-white/10 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* COL 2: Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">
            Quick Navigation
          </h4>
          <nav className="flex flex-col gap-2.5">
            {["About Academy", "Why Choose Us", "Student Journey", "Faculty Members", "Training Grounds", "Success Stories", "Latest Blogs"].map((link, idx) => {
              const hashes = ["#about", "#why-us", "#journey", "#faculty", "#training", "#success", "#blogs"];
              return (
                <Link
                  key={idx}
                  href={hashes[idx]}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                >
                  {link}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* COL 3: Courses */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">
            Our Courses
          </h4>
          <nav className="flex flex-col gap-2.5">
            {["NDA Coaching", "CDS Batch", "AFCAT Classes", "SSB Grooming", "Indian Army Entry", "Navy Cadet Entry"].map((course, idx) => (
              <Link
                key={idx}
                href="#courses"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                {course}
              </Link>
            ))}
          </nav>
        </div>

        {/* COL 4: Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-accent">
            Admissions Office
          </h4>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>Premium Campus, Rajpur Road, Dehradun, Uttarakhand, 248001</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-5 h-5 text-accent shrink-0" />
              <a href="tel:+919876543210" className="hover:text-white transition-colors">
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <a href="mailto:admissions@doondefencecollege.in" className="hover:text-white transition-colors">
                admissions@doondefencecollege.in
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 z-10 relative">
        <p>© 2026 Doon Defence College. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Site Map</Link>
        </div>
      </div>
    </footer>
  );
}
