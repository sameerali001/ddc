"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CadetHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [recoil, setRecoil] = useState(false);

  // Shot impacts (bullet hits) tracking
  interface Hit {
    id: number;
    x: number;
    y: number;
  }
  const [hits, setHits] = useState<Hit[]>([]);
  const [flash, setFlash] = useState(false);

  // Track mouse position relative to the container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Web Audio API Gunshot Sound Synthesizer (Zero-file dependency)
  const playSynthesizedGunshot = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // 1. Noise Buffer (for the blast crackle)
      const bufferSize = ctx.sampleRate * 0.4; // 0.4 seconds duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Low-pass filter to shape the blast frequency (warm, heavy boom)
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.25);

      // Volume envelope (instant attack, exponential decay)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // 2. Sine Oscillator (for the heavy sub-bass thump)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.15);

      oscGain.gain.setValueAtTime(1.2, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // Start both elements
      noise.start();
      osc.start();

      // Stop nodes after completion
      setTimeout(() => {
        try {
          noise.stop();
          osc.stop();
          ctx.close();
        } catch (e) {}
      }, 500);

    } catch (err) {
      console.error("Web Audio Synthesizer blocked:", err);
    }
  };

  const handleShoot = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    // Play the gunshot
    playSynthesizedGunshot();

    // Trigger visual muzzle flash
    setFlash(true);
    setTimeout(() => setFlash(false), 80);

    // Trigger weapon recoil movement on soldier
    setRecoil(true);
    setTimeout(() => setRecoil(false), 120);

    // Add bullet impact hit ring
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const newHit = {
      id: Date.now(),
      x: clickX,
      y: clickY,
    };

    setHits((prev) => [...prev, newHit]);

    // Clean up hit ring after animation completes
    setTimeout(() => {
      setHits((prev) => prev.filter((h) => h.id !== newHit.id));
    }, 600);
  };

  // Parallax translation factors for the soldier image
  const moveX = isHovered ? (mouse.x - 250) * 0.06 : 0;
  const moveY = isHovered ? (mouse.y - 270) * 0.04 : 0;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleShoot}
      className="w-full h-full relative cursor-none select-none overflow-hidden"
      style={{
        backgroundImage: 'url("/academy_hero_bg.jpg"), url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 1. Muzzle Flash Screen Overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            className="absolute inset-0 z-20 bg-red-600 mix-blend-color-dodge pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 2. Aiming Tactical Soldier */}
      <motion.div
        animate={{
          x: moveX - (recoil ? 15 : 0), // recoil kickback
          y: moveY - (recoil ? 8 : 0),
          scale: recoil ? 0.98 : 1.0,
        }}
        transition={{
          type: "spring",
          stiffness: recoil ? 350 : 90,
          damping: recoil ? 15 : 18,
        }}
        className="absolute bottom-0 right-10 w-[78%] h-[85%] flex items-end justify-center pointer-events-none"
      >
        <img
          src="/aiming_soldier.png"
          alt="Tactical Officer Aiming"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          onError={(e) => {
            // Render a stylized neon-red wireframe vector fallback if custom soldier image is missing
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const svgFallback = target.nextSibling as HTMLElement;
            if (svgFallback) svgFallback.style.display = "flex";
          }}
        />

        {/* High-quality backup vector SVG of aiming soldier if image doesn't exist */}
        <div
          className="hidden w-full h-full items-end justify-center pb-6"
          style={{ display: "none" }}
        >
          <svg
            className="w-72 h-[420px] text-red-500/80 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            viewBox="0 0 100 150"
            fill="currentColor"
          >
            {/* Outline representing the soldier aiming with rifle */}
            <path d="M50 15c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm-8 12c-4 0-8 6-8 12v30c0 4 3 6 7 6h18c4 0 7-2 7-6V39c0-6-4-12-8-12h-9z" />
            <path d="M22 45l14-6 24 12 12-4-2 30h-8V58l-12-8-20 6z" stroke="currentColor" strokeWidth="2" fill="none" />
            {/* Rifle outline */}
            <path d="M58 50h36v3h-36zm22 3v4h3v-4z" />
          </svg>
        </div>
      </motion.div>

      {/* 3. Bullet Hit Impact Rings */}
      {hits.map((hit) => (
        <div
          key={hit.id}
          className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: hit.x, top: hit.y }}
        >
          {/* Ripple animation representing shot bullet crater */}
          <div className="w-10 h-10 border border-red-500 rounded-full animate-ping opacity-90" />
          <div className="w-4 h-4 bg-red-600 rounded-full filter blur-[2px] opacity-75" />
          <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1.25 left-1.25" />
        </div>
      ))}

      {/* 4. RED AIMING RETICLE HUD (Follows cursor) */}
      {isHovered && (
        <motion.div
          style={{
            x: mouse.x - 30, // center the 60px container
            y: mouse.y - 30,
          }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
          className="absolute w-[60px] h-[60px] pointer-events-none z-30 select-none flex items-center justify-center"
        >
          {/* Outer target bracket ticks */}
          <div className="absolute inset-0 border border-red-500/40 rounded-full animate-spin-slow" />
          <div className="absolute w-[80%] h-[80%] border border-dashed border-red-500/60 rounded-full" />
          
          {/* Crosshair horizontal/vertical lines */}
          <div className="absolute w-[18px] h-[1px] bg-red-500" />
          <div className="absolute w-[1px] h-[18px] bg-red-500" />
          
          {/* Laser central dot */}
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full border border-white shadow-[0_0_10px_#EF4444]" />
        </motion.div>
      )}

      {/* Background Mist and Shadow Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
