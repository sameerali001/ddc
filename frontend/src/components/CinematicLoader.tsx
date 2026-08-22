"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Preparing Future Officers...");
  const [shouldExit, setShouldExit] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Controls when loading is fully done

  useEffect(() => {
    setIsMounted(true);
    
    // 1. Text cycle updates
    const textInterval = setTimeout(() => {
      setLoadingText("Loading Academy Experience...");
    }, 1500);

    const finishTextInterval = setTimeout(() => {
      setLoadingText("Discipline. Education. Leadership.");
    }, 3000);

    // 2. Linear loader increment
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          setIsLoaded(true); // Signal loader completion
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => {
      clearInterval(interval);
      clearTimeout(textInterval);
      clearTimeout(finishTextInterval);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!shouldExit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#050914] text-white overflow-hidden"
        >
          {/* Volumetric Morning Sunrise Light in background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#D4AF37]/15 to-transparent filter blur-3xl opacity-80 animate-pulse-slow pointer-events-none" />

          {/* Floating dust/sparkle particles - Protected against hydration mismatches */}
          {isMounted && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-accent rounded-full opacity-60 animate-bounce"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${3 + Math.random() * 5}s`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col items-center max-w-lg px-6 text-center z-10">
            {/* Pulsing Academy Emblem Outline */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-28 h-28 mb-8 flex items-center justify-center border-2 border-accent/40 rounded-full bg-[#0b132b]/80 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            >
              {/* Shield Outline Icon */}
              <svg
                className="w-16 h-16 text-accent animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </motion.div>

            {/* Jogging Cadet Silhouette (Moving across bottom background) */}
            <div className="relative w-full h-16 mb-6 overflow-hidden flex items-end justify-center">
              <motion.div
                initial={{ x: -180 }}
                animate={{ x: 180 }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                className="flex items-end text-accent/40"
              >
                {/* SVG Silhouette Runner */}
                <svg className="w-10 h-10" viewBox="0 0 100 100" fill="currentColor">
                  {/* Jogger silhouette frames simulated with CSS keyframe */}
                  <path d="M 50 15 A 6 6 0 1 0 50 27 A 6 6 0 1 0 50 15 M 50 28 Q 42 34 38 48 Q 36 55 38 65 L 43 85 L 49 85 L 45 68 L 52 50 Q 55 45 58 48 L 65 65 L 68 85 L 74 85 L 69 62 Q 65 52 59 40 L 53 29 Z" />
                  <path d="M 32 36 Q 40 40 46 38 L 50 44 L 43 55 Q 38 60 30 50 Z" />
                </svg>
              </motion.div>
              {/* Floor Academy ground line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/20" />
            </div>

            {/* Slogan */}
            <h2 className="text-xl font-bold tracking-[0.2em] font-display text-accent mb-2 uppercase">
              Doon Defence College
            </h2>

            {/* Dynamic Loading Text */}
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4 }}
              className="text-sm tracking-wider text-gray-400 font-light h-6 mb-8"
            >
              {loadingText}
            </motion.p>

            {/* Loading controls / entry button */}
            {!isLoaded ? (
              <div className="flex flex-col items-center">
                {/* Loading progress bar */}
                <div className="w-64 h-[3px] bg-white/10 rounded-full overflow-hidden mb-3 relative">
                  <motion.div
                    className="h-full bg-accent"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>

                {/* Loading percentage */}
                <span className="text-xs tracking-widest text-accent/80 font-mono">
                  {Math.round(progress)}%
                </span>
              </div>
            ) : (
              <motion.button
                onClick={() => setShouldExit(true)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-accent hover:bg-accent-light text-[#0B132B] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 hover:scale-105"
              >
                Enter Academy
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
