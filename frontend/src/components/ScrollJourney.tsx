"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, BookOpen, Award, ShieldAlert, GraduationCap } from "lucide-react";

interface Milestone {
  stage: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  detailList: string[];
  cadetStance: string; // "dreamer" | "scholar" | "athlete" | "cadet" | "officer"
}

const milestones: Milestone[] = [
  {
    stage: "Stage 01",
    title: "The Dream",
    description: "Every great officer's journey begins with a spark of patriotism. We help direct that raw passion into a structured career vision.",
    icon: <Sparkles className="w-6 h-6 text-accent" />,
    detailList: [
      "Inspirational Seminars & Seminars",
      "Goal setting & path identification",
      "Parental counseling & alignment"
    ],
    cadetStance: "Dreamer"
  },
  {
    stage: "Stage 02",
    title: "Academic Preparation",
    description: "Cracking written tests requires intellectual caliber. We provide deep syllabus drills, weekly tests, and analytical tricks.",
    icon: <BookOpen className="w-6 h-6 text-accent" />,
    detailList: [
      "Integrated Board + NDA coaching",
      "Doubt clearing sessions with PhD faculty",
      "Speed-solving tips for Mathematics & GAT"
    ],
    cadetStance: "Scholar"
  },
  {
    stage: "Stage 03",
    title: "Physical Training",
    description: "Building the stamina, grit, and physical courage required to survive service academies like NDA, IMA, and AFA.",
    icon: <Award className="w-6 h-6 text-accent" />,
    detailList: [
      "Standard GTO obstacle course runs",
      "Morning PT drills & cross-country running",
      "Sports, swimming, and reflex conditioning"
    ],
    cadetStance: "Athlete"
  },
  {
    stage: "Stage 04",
    title: "Leadership Grooming",
    description: "Officer Like Qualities (OLQs) are developed, not born. We groom communication, decision-making under stress, and teamwork.",
    icon: <ShieldAlert className="w-6 h-6 text-accent" />,
    detailList: [
      "Group discussions & lecturettes",
      "Command tasks & situational judgments",
      "Psychology test simulations by ex-assessors"
    ],
    cadetStance: "Cadet"
  },
  {
    stage: "Stage 05",
    title: "The Commissioned Officer",
    description: "The dream is realized. The cadet steps out of the gates as a Commissioned Lieutenant, Flying Officer, or Sub-Lieutenant.",
    icon: <GraduationCap className="w-6 h-6 text-accent" />,
    detailList: [
      "SSB Recommendation celebration",
      "President's Commissioning parade readiness",
      "Serving the motherland with honor"
    ],
    cadetStance: "Officer"
  }
];

export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Smooth out the scroll progress for animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  });

  // Map progress to Cadet vertical translation along the timeline
  const cadetY = useTransform(smoothProgress, [0, 1], ["0%", "85%"]);
  
  // Transform background glow color based on progress
  const glowColor = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["rgba(212,175,55,0.1)", "rgba(75,111,68,0.1)", "rgba(11,19,43,0.15)", "rgba(212,175,55,0.15)", "rgba(75,111,68,0.2)"]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row gap-12"
    >
      {/* Dynamic glow base */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-3xl filter blur-3xl transition-colors duration-500"
        style={{ backgroundColor: glowColor }}
      />

      {/* LEFT: Timeline Path & walking Cadet (Sticky) */}
      <div className="hidden md:flex md:w-1/3 relative h-[600px] sticky top-32 justify-center items-center">
        {/* The Timeline Track Line */}
        <div className="absolute w-[4px] h-[90%] bg-gradient-to-b from-primary via-accent to-secondary rounded-full">
          {/* Scroll progress fill overlay */}
          <motion.div
            className="absolute top-0 left-0 w-full bg-accent rounded-full shadow-[0_0_10px_#D4AF37]"
            style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
          />
        </div>

        {/* Cadet Avatar walking down the timeline */}
        <motion.div
          className="absolute w-28 h-40 flex flex-col items-center justify-center bg-primary-light border-2 border-accent rounded-2xl shadow-xl p-4 text-center z-10"
          style={{ y: cadetY }}
        >
          {/* Cadet Visual Emblem depending on stage */}
          <div className="w-14 h-14 rounded-full bg-[#0b132b] flex items-center justify-center border border-accent/40 mb-2 relative overflow-hidden">
            {/* Saffron/White/Green background flag stripes */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-[#FF9933]/10" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#128807]/10" />
            
            {/* Animating the icon inside the avatar */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-accent"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </motion.div>
          </div>

          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Active Status</span>
          <motion.div className="text-xs font-bold text-accent font-display truncate w-full">
            {useTransform<number, string>(smoothProgress, (p) => {
              if (p < 0.2) return "The Dreamer";
              if (p < 0.4) return "The Scholar";
              if (p < 0.6) return "The Athlete";
              if (p < 0.8) return "The Academy Cadet";
              return "The Commissioned Officer";
            })}
          </motion.div>

          {/* Miniature shoulder star indicator for Officer stage */}
          <motion.div
            className="flex gap-0.5 mt-1"
            style={{
              opacity: useTransform(smoothProgress, [0.75, 0.9], [0, 1])
            }}
          >
            {[...Array(2)].map((_, i) => (
              <span key={i} className="text-[8px] text-accent">★</span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT: Text Content Cards */}
      <div className="w-full md:w-2/3 flex flex-col gap-16 md:py-12">
        {milestones.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="glass-panel hover:shadow-xl rounded-2xl p-8 border border-gray-200 transition-all duration-300 relative group overflow-hidden"
          >
            {/* Saffron and Green side border highlight */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#FF9933] via-[#FFFFFF] to-[#128807]" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                {m.stage}
              </span>
              <div className="flex items-center gap-2 bg-[#0B132B]/5 px-3 py-1 rounded-full text-xs font-medium text-primary">
                {m.icon}
                <span>Stance: {m.cadetStance}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold font-display text-primary mb-3">
              {m.title}
            </h3>

            <p className="text-text-secondary leading-relaxed mb-6 text-sm">
              {m.description}
            </p>

            <h4 className="text-xs uppercase font-bold tracking-wider text-primary mb-3">
              Milestone Focus Area
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {m.detailList.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
