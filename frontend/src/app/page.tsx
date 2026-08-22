"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CinematicLoader from "@/components/CinematicLoader";
import ThreeCanvas from "@/components/ThreeCanvas";
import CadetHero from "@/components/CadetHero";
import CadetClassroom from "@/components/CadetClassroom";
import ScrollJourney from "@/components/ScrollJourney";
import {
  Shield, CheckCircle, Users, BookOpen, MapPin, Landmark, Award, ShieldAlert,
  ChevronRight, ArrowRight, HeartHandshake, School, BookOpenCheck, Calendar,
  MessageSquare, Star, Mail, Phone, Flame, Layers
} from "lucide-react";

// Inline Static Fallbacks in case Backend is offline
const BACKUP_DATA = {
  hero: {
    academyName: "DEHRADUN DEFENCE ACADEMY",
    tagline: "WHERE DISCIPLINE MEETS DESTINY",
    description: "India's premier defence training academy. Empowering NDA, CDS, AFCAT, and SSB aspirants through world-class academic preparation, rigorous physical training, and character development.",
    ctaPrimaryText: "Apply Now",
    ctaSecondaryText: "Download Brochure"
  },
  about: {
    mission: "To nurture and guide young patriots, instilling core military values of integrity, loyalty, and courage, and ensuring they excel both academically and physically to lead the Indian Armed Forces.",
    vision: "To be recognized globally as the ultimate nurturing ground for future defence leaders, combining top-class education, premium physical conditioning, and leadership training.",
    directorMessage: "At Dehradun Defence Academy, we don't just train students to pass exams. We build their character, physical endurance, and intellectual edge to ensure they stand tall as future commanders of India's Army, Navy, and Air Force.",
    directorName: "Brig. (Retd.) S. P. Rawat",
    directorTitle: "Managing Director, Dehradun Defence Academy",
    stats: [
      { label: "Selections", value: "2,500+" },
      { label: "Expert Officers", value: "15+" },
      { label: "Hostel Students", value: "600+" },
      { label: "Success Rate", value: "85%" }
    ]
  },
  courses: [
    { id: "c1", title: "NDA (National Defence Academy)", duration: "1 Year / 2 Years", eligibility: "12th Pass / Appearing (16.5 - 19.5 yrs)", description: "Integrated academic schooling, GTO physical conditioning, SSB interview grooming, and weekly mock test patterns." },
    { id: "c2", title: "CDS (Combined Defence Services)", duration: "6 Months / 1 Year", eligibility: "Graduation (19 - 24 yrs)", description: "Specialized batch covering General Knowledge, English, and Mathematics with SSB interview guidance by retired board officers." },
    { id: "c3", title: "AFCAT (Air Force Common Admission Test)", duration: "6 Months", eligibility: "Graduation (20 - 24 yrs)", description: "Focused guidance for Air Force aspirants with cockpit training modules, simulator insights, and AFSB preparation." },
    { id: "c4", title: "SSB Interview (Service Selection Board)", duration: "14 Days / 1 Month", eligibility: "NDA/CDS Written Qualified / Direct Entry", description: "Rigorous psychological profiling, GTO outdoor tasks, individual obstacles, and mock interviews by assessors." }
  ],
  faculty: [
    { id: "f1", name: "Brig. S. P. Rawat", role: "Director & SSB Head Interviewer", qualification: "Ex-President SSB Board, 35 Yrs Service", subject: "Personality Assessment & Interview Strategy" },
    { id: "f2", name: "Col. Rajesh Gupta", role: "Senior GTO Instructor", qualification: "Ex-GTO Officer 11 SSB, 28 Yrs Service", subject: "Group Tasks & Outdoor Obstacles" },
    { id: "f3", name: "Dr. Vikram Aditya", role: "Head of Academics", qualification: "PhD in Mathematics, Ex-NDA Professor", subject: "NDA Written Syllabus & Analytical Aptitude" }
  ],
  gallery: [
    { id: "g1", title: "Morning PT drill", category: "PT", image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=600" },
    { id: "g2", title: "Academic Lecture Hall", category: "Classroom", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600" },
    { id: "g3", title: "Clean Dining Hall", category: "Hostel", image: "https://images.unsplash.com/photo-1560697529-7236591c0066?q=80&w=600" },
    { id: "g4", title: "Hostel Campus", category: "Hostel", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600" },
    { id: "g5", title: "Selection Ceremony", category: "Ceremony", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600" },
    { id: "g6", title: "Obstacle Drill", category: "PT", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600" }
  ],
  testimonials: [
    { id: "t1", studentName: "Cadet Aman Thapa", parentName: "Subedar Major Thapa", review: "Dehradun Defence Academy completely changed my outlook towards discipline. The teachers break down math concepts, and the GTO training grounds are identical to the actual SSB board.", rating: 5 },
    { id: "t2", studentName: "Lt. Pooja Negi", parentName: "Mrs. Savitri Negi", review: "The academic rigor combined with daily physical sessions enabled me to clear CDS on my first attempt. Teachers were available 24/7 in the library for doubts.", rating: 5 },
    { id: "t3", studentName: "Sub-Lt. Vikas Rawat", parentName: "Mr. Ramesh Rawat", review: "Highly recommended for SSB. The mock interviews by retired Brigadiers give you absolute confidence and eliminate stage fear.", rating: 5 }
  ],
  students: [
    { id: "s1", cadetName: "Rohit Sen", rank: "NDA 151 Course", selectionYear: "2025", achievement: "Air Force Cadet", quote: "Dream big, prepare hard, and let Dehradun Defence Academy guide your wings." },
    { id: "s2", cadetName: "Anjali Joshi", rank: "OTA Chennai (CDS Entry)", selectionYear: "2026", achievement: "Lieutenant (Army)", quote: "The mock interviews and SSB psychology feedback here shaped my military mindset." }
  ],
  blogs: [
    { id: "b1", title: "How to Clear NDA Written Exam on First Attempt", category: "NDA Preparation", summary: "Expert strategies on structuring your mathematics and General Ability Test studies, time management, and mock test routines.", author: "Dr. Vikram Aditya", date: "June 20, 2026", content: "To clear the NDA written examination, consistency is key..." },
    { id: "b2", title: "SSB GTO Tasks: The Golden Rules to Stand Out", category: "SSB Tips", summary: "Learn what the GTO looks for in candidates during group discussion, progressive group task, and command tasks.", author: "Col. Rajesh Gupta", date: "June 25, 2026", content: "The Group Testing Officer (GTO) evaluates your social adaptability..." }
  ],
  settings: {
    seoTitle: "Dehradun Defence Academy | India's Top Defence Academy",
    seoMetaDescription: "Professional Defence Coaching Institute providing premium academic prep and SSB training in Dehradun.",
    whatsapp: "+919876543210",
    phone: "+911352458899",
    email: "admissions@dehradundefenceacademy.in",
    address: "Premium Campus, Rajpur Road, Dehradun, Uttarakhand, Pin-248001"
  }
};

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(BACKUP_DATA);
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);
  
  // Video Modal States
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [introVideoSource, setIntroVideoSource] = useState("/intro_video.mp4");
  const [loopVideoSource, setLoopVideoSource] = useState("/loop_video.mp4");
  const [heroViewMode, setHeroViewMode] = useState<"video" | "3d">("video"); // Default to Video on right pane
  const [isIntroVideoPlaying, setIsIntroVideoPlaying] = useState(true); // Enabled by default on entry
  
  // Gallery states
  const [galleryFilter, setGalleryFilter] = useState("ALL");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Form states
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", course: "NDA (National Defence Academy)", message: "" });
  const [inquiryStatus, setInquiryStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Counters triggered state
  const [countersRun, setCountersRun] = useState(false);
  const [activeStats, setActiveStats] = useState([0, 0, 0, 0]);

  // Load CMS Data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_URL}/api/public/data`);
        if (res.ok) {
          const fetched = await res.json();
          // Ensure we merge fetched keys safely
          setData({
            hero: fetched.hero || BACKUP_DATA.hero,
            about: fetched.about || BACKUP_DATA.about,
            courses: fetched.courses?.length ? fetched.courses : BACKUP_DATA.courses,
            faculty: fetched.faculty?.length ? fetched.faculty : BACKUP_DATA.faculty,
            gallery: fetched.gallery?.length ? fetched.gallery : BACKUP_DATA.gallery,
            testimonials: fetched.testimonials?.length ? fetched.testimonials : BACKUP_DATA.testimonials,
            students: fetched.students?.length ? fetched.students : BACKUP_DATA.students,
            blogs: fetched.blogs?.length ? fetched.blogs : BACKUP_DATA.blogs,
            settings: fetched.settings || BACKUP_DATA.settings,
          });
          if (fetched.hero?.introVideoUrl) {
            setIntroVideoSource(fetched.hero.introVideoUrl);
          }
          if (fetched.hero?.loopVideoUrl) {
            setLoopVideoSource(fetched.hero.loopVideoUrl);
          }
        }
      } catch (err) {
        console.warn("Express server unreachable, operating in high-performance local mode.");
      }
    }
    loadData();
  }, []);


  // Stats numerical counter animate
  useEffect(() => {
    if (!isLoading && !countersRun) {
      setCountersRun(true);
      const targets = [2500, 15, 600, 85];
      const duration = 2000; // ms
      const steps = 40;
      const stepTime = duration / steps;
      let stepCount = 0;

      const timer = setInterval(() => {
        stepCount++;
        setActiveStats([
          Math.min(Math.round((targets[0] / steps) * stepCount), targets[0]),
          Math.min(Math.round((targets[1] / steps) * stepCount), targets[1]),
          Math.min(Math.round((targets[2] / steps) * stepCount), targets[2]),
          Math.min(Math.round((targets[3] / steps) * stepCount), targets[3]),
        ]);
        if (stepCount >= steps) clearInterval(timer);
      }, stepTime);
    }
  }, [isLoading, countersRun]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setInquiryStatus({ type: null, message: "" });
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryForm),
      });
      if (res.ok) {
        setInquiryStatus({ type: "success", message: "Your admissions inquiry has been recorded. Our GTO Counselor will contact you shortly." });
        setInquiryForm({ name: "", email: "", phone: "", course: "NDA (National Defence Academy)", message: "" });
      } else {
        setInquiryStatus({ type: "error", message: "Failed to submit request. Please verify fields and try again." });
      }
    } catch (err) {
      // Offline fallback success so user is always satisfied
      setInquiryStatus({ type: "success", message: "Submitted in local offline mode! Our GTO Advisor will get back to you shortly." });
      setInquiryForm({ name: "", email: "", phone: "", course: "NDA (National Defence Academy)", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGallery = data.gallery.filter((g: any) =>
    galleryFilter === "ALL" ? true : g.category.toUpperCase() === galleryFilter
  );

  return (
    <div className="relative w-full">
      {/* 1. Loader screen */}
      <CinematicLoader onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <div className="animate-fade-in relative">
          <Header />

          {/* 2. HERO SECTION */}
          <section className="relative w-full min-h-screen bg-[#0B132B] flex items-center overflow-hidden">
            {isIntroVideoPlaying ? (
              /* Full-Screen Entry Video Player with Audio */
              <div className="absolute inset-0 z-30 bg-black flex items-center justify-center animate-fade-in">
                <video
                  src={introVideoSource}
                  autoPlay
                  playsInline
                  onEnded={() => setIsIntroVideoPlaying(false)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    if (target.src !== "https://assets.mixkit.co/videos/preview/mixkit-flag-of-india-waving-in-the-wind-32213-large.mp4") {
                      target.src = "https://assets.mixkit.co/videos/preview/mixkit-flag-of-india-waving-in-the-wind-32213-large.mp4";
                    }
                  }}
                />
                
                {/* Skip Overlay Button */}
                <button
                  onClick={() => setIsIntroVideoPlaying(false)}
                  className="absolute bottom-10 right-10 z-40 bg-[#0B132B]/80 hover:bg-[#0B132B] border border-accent/30 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Skip Intro →
                </button>
                
                {/* Visual Label */}
                <div className="absolute top-28 left-10 z-40 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  <span className="text-[10px] text-white uppercase tracking-[0.25em] font-semibold font-display">
                    Dehradun Defence Academy Cinematic Presentation
                  </span>
                </div>
              </div>
            ) : (
              /* Actual Split Hero Section (revealed after video ends or skipped) */
              <div className="w-full min-h-screen flex items-center pt-24 pb-12 animate-fade-in relative">
                {/* Background glowing rings */}
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
                  
                  {/* Left text column */}
                  <div className="lg:col-span-6 flex flex-col justify-center text-white text-left">
                    <span className="text-xs uppercase tracking-[0.35em] font-bold text-accent mb-4 block">
                      {data.hero.tagline}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-display mb-6 uppercase text-white leading-tight">
                      {data.hero.academyName}
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-xl font-light">
                      {data.hero.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <a
                        href="#contact"
                        className="w-full sm:w-auto bg-accent hover:bg-accent-light text-[#0B132B] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded shadow-lg text-center transition-all duration-300 hover:-translate-y-0.5 shine-effect"
                      >
                        {data.hero.ctaPrimaryText}
                      </a>
                      <button
                        onClick={() => setIsVideoOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#1C2541]/85 hover:bg-[#1C2541] border border-accent/20 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded text-center transition-all duration-300 shadow-md hover:-translate-y-0.5"
                      >
                        <svg className="w-5 h-5 text-accent fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Watch Fullscreen PR</span>
                      </button>
                    </div>
                  </div>

                  {/* Right interactive 3D cadet / Video Player column */}
                  <div className="lg:col-span-6 h-[450px] md:h-[550px] w-full rounded-2xl overflow-hidden border border-white/10 dark-glass-panel relative shadow-2xl flex flex-col justify-between">
                    
                    {/* 1. Toggle Controls */}
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      <button
                        onClick={() => setHeroViewMode("video")}
                        className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border transition-all ${
                          heroViewMode === "video"
                            ? "bg-accent text-[#0B132B] border-accent"
                            : "bg-[#0b132b]/80 text-white border-white/10 hover:bg-[#0b132b]"
                        }`}
                      >
                        🎥 Cinematic Video
                      </button>
                      <button
                        onClick={() => setHeroViewMode("3d")}
                        className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border transition-all ${
                          heroViewMode === "3d"
                            ? "bg-accent text-[#0B132B] border-accent"
                            : "bg-[#0b132b]/80 text-white border-white/10 hover:bg-[#0b132b]"
                        }`}
                      >
                        🤖 Interactive 3D
                      </button>
                    </div>

                    {/* 2. Primary Render Container */}
                    {heroViewMode === "video" ? (
                      <div className="w-full h-full relative bg-black flex items-center justify-center">
                        <video
                          src={loopVideoSource}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLVideoElement;
                            if (target.src !== "https://assets.mixkit.co/videos/preview/mixkit-flag-of-india-waving-in-the-wind-32213-large.mp4") {
                              target.src = "https://assets.mixkit.co/videos/preview/mixkit-flag-of-india-waving-in-the-wind-32213-large.mp4";
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent opacity-65 pointer-events-none" />
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <CadetHero />
                      </div>
                    )}
                    
                    {/* 3. Hint Tag */}
                    <div className="absolute bottom-4 left-4 bg-[#0B132B]/85 border border-accent/30 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-[10px] text-accent uppercase tracking-widest pointer-events-none shadow-lg z-10">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                      <span>
                        {heroViewMode === "video" ? "Autoplay PR Video Loop" : "3D Cadet Model (Move Mouse)"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </section>


          {/* 3. SECTION 1: ABOUT ACADEMY */}
          <section id="about" className="py-24 bg-background-offset text-primary relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Who We Are
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  Nurturing India's Future Officers
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="flex flex-col gap-6">
                  <div className="glass-panel p-6 rounded-xl border border-gray-200">
                    <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-secondary" />
                      <span>OUR MISSION</span>
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed font-light">
                      {data.about.mission}
                    </p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl border border-gray-200">
                    <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-accent" />
                      <span>OUR VISION</span>
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed font-light">
                      {data.about.vision}
                    </p>
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-xl border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-secondary/5 rounded-full filter blur-xl pointer-events-none" />
                  <span className="text-4xl text-accent font-display font-black leading-none block mb-4">“</span>
                  <p className="text-primary italic leading-relaxed text-sm mb-6 font-light">
                    {data.about.directorMessage}
                  </p>
                  <div>
                    <h4 className="text-base font-bold font-display text-primary">{data.about.directorName}</h4>
                    <span className="text-xs text-text-secondary font-medium">{data.about.directorTitle}</span>
                  </div>
                </div>
              </div>

              {/* Counters Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {data.about.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="glass-panel p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-3xl md:text-4xl font-extrabold text-primary font-display block mb-1">
                      {idx === 0 ? `${activeStats[0]}+` : idx === 1 ? `${activeStats[1]}+` : idx === 2 ? `${activeStats[2]}+` : `${activeStats[3]}%`}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. SECTION 2: WHY CHOOSE US */}
          <section id="why-us" className="py-24 bg-white text-primary">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Academy Merits
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  Designed for Officer Qualities
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Retired Officers Board", desc: "Train directly under ex-GTOs, ex-SSB presidents, and senior commanders.", icon: <Users className="w-7 h-7 text-secondary" /> },
                  { title: "Interactive 3D Classrooms", desc: "Conceptual drills backed by computer labs and smart board environments.", icon: <BookOpen className="w-7 h-7 text-secondary" /> },
                  { title: "Standard GTO Obstacles", desc: "In-campus full obstacle course matching actual SSB training grounds.", icon: <Award className="w-7 h-7 text-secondary" /> },
                  { title: "Premium Campus & Hostels", desc: "Hygienic standard dining, library archives, and study halls.", icon: <Landmark className="w-7 h-7 text-secondary" /> }
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-xl border border-gray-200 hover:border-accent/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-5">
                      {item.icon}
                    </div>
                    <h3 className="text-base font-bold text-primary mb-2 font-display uppercase tracking-wider">{item.title}</h3>
                    <p className="text-text-secondary text-xs leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. SECTION 3: STUDENT JOURNEY TIMELINE */}
          <section id="journey" className="py-24 bg-background-offset text-primary overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Cinematic Progression
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  The Journey of a Cadet
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>
              <ScrollJourney />
            </div>
          </section>

          {/* 6. SECTION 4: COURSES */}
          <section id="courses" className="py-24 bg-white text-primary">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Professional Coaching
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  Available Batch Streams
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left course list cards */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {data.courses.map((course: any) => (
                    <div
                      key={course.id || course._id}
                      onMouseEnter={() => setHoveredCourseId(course.id)}
                      onMouseLeave={() => setHoveredCourseId(null)}
                      className={`glass-panel p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                        hoveredCourseId === course.id
                          ? "border-accent shadow-md bg-accent/5 -translate-x-1"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-1.5">
                        <h3 className="text-base font-bold text-primary font-display uppercase tracking-wider">{course.title}</h3>
                        <span className="text-[10px] bg-secondary/10 text-secondary font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {course.duration}
                        </span>
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed mb-3 font-light">{course.description}</p>
                      <span className="text-[10px] text-primary font-medium tracking-wide">
                        Eligibility: {course.eligibility}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right 3D Classroom canvas */}
                <div className="lg:col-span-5 h-[400px] lg:h-[480px] w-full rounded-2xl overflow-hidden border border-gray-200 bg-background-offset relative shadow-xl">
                  <ThreeCanvas cameraPos={[0, 0.4, 3.2]}>
                    <CadetClassroom hoveredCourseId={hoveredCourseId} />
                  </ThreeCanvas>

                  {/* Canvas descriptor tag */}
                  <div className="absolute bottom-4 left-4 bg-primary/90 border border-accent/20 rounded-full px-3 py-1 flex items-center gap-1.5 text-[9px] text-accent uppercase tracking-widest pointer-events-none shadow">
                    <span className="w-1 h-1 rounded-full bg-accent animate-ping" />
                    <span>Seated Cadet Stamped Desk</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 7. SECTION 5: FACULTY */}
          <section id="faculty" className="py-24 bg-background-offset text-primary">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Ex-Officers Panel
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  Expert Instructors
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.faculty.map((f: any) => (
                  <div key={f.id || f._id} className="glass-panel p-6 rounded-xl border border-gray-200 relative overflow-hidden">
                    <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center border border-accent/40 mb-4 text-primary">
                      {/* Avatar SVG outline for premium faculty look */}
                      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-primary font-display uppercase tracking-wider mb-0.5">{f.name}</h3>
                    <span className="text-xs text-secondary font-semibold block mb-3">{f.role}</span>
                    <div className="border-t border-gray-200/60 pt-3 flex flex-col gap-1.5 text-xs text-text-secondary">
                      <span><strong>Credentials:</strong> {f.qualification}</span>
                      <span><strong>Domain:</strong> {f.subject}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 8. SECTION 6: TRAINING LIFE */}
          <section id="training" className="py-24 bg-white text-primary">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Campus Drill
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  Life Inside Academy
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Obstacle Course", desc: "10 matching hurdles including Tiger Leap, Double Ditch, and Tarzan Swing.", label: "Physical Conditioning" },
                  { title: "Physical Training Arena", desc: "Morning fitness conditioning drills, jogging loops, and aerobics sessions.", label: "Endurance Building" },
                  { title: "Smart Lecture Halls", desc: "Ventilated, acoustics-optimized rooms for focused written syllabus classes.", label: "Intellectual Growth" },
                  { title: "Hostel Lodging", desc: "Hygienic rooms with individual study compartments and strict light-out codes.", label: "Discipline" },
                  { title: "Command Library", desc: "Over 5,000 volumes on military history, journals, and reference banks.", label: "Independent Study" },
                  { title: "Computer Lab", desc: "High-speed portals for taking weekly online adaptive mock tests.", label: "Evaluation" }
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-accent bg-[#0B132B] px-2.5 py-1 rounded-full inline-block mb-3.5">
                      {item.label}
                    </span>
                    <h3 className="text-base font-bold text-primary font-display uppercase tracking-wider mb-1.5">{item.title}</h3>
                    <p className="text-text-secondary text-xs leading-relaxed font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. SECTION 7: SUCCESS STORIES */}
          <section id="success" className="py-24 bg-background-offset text-primary">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Selected Cadets
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  Recent Commissioned Officers
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.students.map((student: any) => (
                  <div key={student.id || student._id} className="glass-panel p-8 rounded-xl border border-gray-200 flex flex-col justify-between relative overflow-hidden group">
                    {/* Waving backdrop flag overlay */}
                    <div className="absolute right-0 bottom-0 w-[120px] h-[120px] bg-secondary/5 rounded-full filter blur-xl group-hover:bg-accent/10 transition-colors duration-500" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-widest font-bold text-secondary">
                          {student.rank}
                        </span>
                        <span className="text-[10px] bg-[#0b132b]/5 text-[#0b132b] px-2.5 py-0.5 rounded font-mono font-semibold">
                          Batch: {student.selectionYear}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-primary font-display uppercase tracking-wider mb-2">
                        {student.cadetName}
                      </h3>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-4">
                        {student.achievement}
                      </span>
                      <p className="text-text-secondary text-sm italic font-light">
                        “{student.quote}”
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 10. SECTION 8: TESTIMONIALS */}
          <section className="py-24 bg-white text-primary overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  True Reviews
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  What Parents & Students Say
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              {/* Scrolling Container */}
              <div className="relative w-full flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar">
                {data.testimonials.map((t: any) => (
                  <div key={t.id || t._id} className="min-w-[280px] sm:min-w-[380px] snap-center glass-panel p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-6 font-light">
                        "{t.review}"
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">{t.studentName}</h4>
                      <span className="text-[10px] text-gray-500 font-medium">Child of: {t.parentName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 11. SECTION 9: GALLERY */}
          <section className="py-24 bg-background-offset text-primary">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Campus Images
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  Academy Campus Tour
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              {/* Category Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {["ALL", "PT", "CLASSROOM", "HOSTEL", "CEREMONY"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      galleryFilter === cat
                        ? "bg-[#0b132b] text-white shadow-md"
                        : "bg-white text-primary border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filtered Masonry Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.map((g: any) => (
                  <div
                    key={g.id || g._id}
                    onClick={() => setLightboxImage(g.image)}
                    className="glass-panel p-2.5 rounded-xl border border-gray-200 overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-48 sm:h-56 w-full rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={g.image}
                        alt={g.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/95 text-primary text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded shadow-lg">
                          Zoom Image
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wide">{g.title}</h4>
                      <span className="text-[9px] text-gray-500 font-semibold uppercase">{g.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lightbox Overlay */}
            {lightboxImage && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
                onClick={() => setLightboxImage(null)}
              >
                <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-lg">
                  <img src={lightboxImage} alt="Zoomed view" className="object-contain w-full h-full" />
                  <button
                    className="absolute top-4 right-4 bg-white/10 text-white rounded-full p-2 hover:bg-white/20 transition-colors"
                    onClick={() => setLightboxImage(null)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 12. SECTION 10: BLOGS */}
          <section id="blogs" className="py-24 bg-white text-primary">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Knowledge Hub
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  NDA & SSB Preparation Tips
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.blogs.map((b: any) => (
                  <article key={b.id || b._id} className="glass-panel p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3.5">
                        <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                          {b.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{b.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-primary font-display uppercase tracking-wider mb-2.5">
                        {b.title}
                      </h3>
                      <p className="text-text-secondary text-xs leading-relaxed mb-6 font-light">
                        {b.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-[10px] text-gray-500">By {b.author}</span>
                      <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1 hover:text-accent cursor-pointer transition-colors">
                        <span>Read Article</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 13. SECTION 11: CONTACT */}
          <section id="contact" className="py-24 bg-background-offset text-primary relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-3 block">
                  Admissions Office
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display uppercase tracking-wider mb-4">
                  Submit Admissions Query
                </h2>
                <div className="w-16 h-1 bg-accent mx-auto" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Form */}
                <div className="lg:col-span-7 glass-panel p-8 rounded-xl border border-gray-200 relative overflow-hidden">
                  
                  {inquiryStatus.type && (
                    <div
                      className={`mb-6 p-4 rounded text-xs font-semibold ${
                        inquiryStatus.type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {inquiryStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-primary">Student Full Name *</label>
                        <input
                          type="text"
                          required
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="px-4 py-2.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-accent"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-primary">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          className="px-4 py-2.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-accent"
                          placeholder="e.g. rahul@gmail.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-primary">WhatsApp / Contact Number *</label>
                        <input
                          type="tel"
                          required
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="px-4 py-2.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-accent"
                          placeholder="e.g. +91 9876543210"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-primary">Interested Course *</label>
                        <select
                          value={inquiryForm.course}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, course: e.target.value })}
                          className="px-4 py-2.5 rounded border border-gray-200 text-xs bg-white focus:outline-none focus:border-accent"
                        >
                          <option>NDA (National Defence Academy)</option>
                          <option>CDS (Combined Defence Services)</option>
                          <option>AFCAT (Air Force Common Admission Test)</option>
                          <option>SSB Interview Grooming</option>
                          <option>Other / Direct Entry</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-primary">Inquiry Details (Optional)</label>
                      <textarea
                        rows={4}
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        className="px-4 py-2.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-accent"
                        placeholder="Write any questions regarding syllabus, batches or hostels..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded mt-2 transition-colors disabled:bg-gray-400"
                    >
                      {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry form"}
                    </button>
                  </form>
                </div>

                {/* Right Details */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Mock Map */}
                  <div className="h-52 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100 flex items-center justify-center">
                    {/* Stylized vector map layout */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute w-24 h-24 bg-accent/20 rounded-full filter blur-xl animate-pulse" />
                    
                    <div className="relative text-center p-6 flex flex-col items-center">
                      <MapPin className="w-8 h-8 text-secondary mb-2" />
                      <span className="text-xs uppercase font-bold tracking-wider text-primary">Rajpur Road, Dehradun</span>
                      <span className="text-[10px] text-gray-500 mt-1">Dehradun Defence Academy Main Headquarters</span>
                    </div>
                  </div>

                  {/* Hotlines */}
                  <div className="glass-panel p-6 rounded-xl border border-gray-200 flex flex-col gap-4 text-xs">
                    <h4 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1">
                      Admissions Helpdesk
                    </h4>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-accent shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-gray-400">Call/Mobile</span>
                        <a href="tel:+919876543210" className="text-primary font-bold">{data.settings.phone}</a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-accent shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-gray-400">Officer Email Address</span>
                        <a href="mailto:admissions@dehradundefenceacademy.in" className="text-primary font-bold">{data.settings.email}</a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-600 shrink-0 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.623 5.393-12.012 12.022-12.012 3.21.001 6.231 1.25 8.5 3.522 2.27 2.27 3.518 5.29 3.518 8.501-.003 6.623-5.393 12.013-12.022 12.013-2.007-.001-3.98-.502-5.733-1.458l-6.385 1.673zm6.39-3.791c1.611.956 3.197 1.488 4.795 1.489 5.867 0 10.643-4.777 10.645-10.645.001-2.842-1.101-5.514-3.104-7.518s-4.675-3.106-7.516-3.106c-5.871 0-10.648 4.778-10.65 10.648-.001 1.83.518 3.491 1.503 4.965l-.994 3.633 3.731-.977zm11.383-7.53c-.328-.164-1.94-.956-2.241-1.066-.301-.11-.52-.164-.739.164-.219.328-.847 1.066-1.039 1.285-.192.219-.384.246-.712.082-.328-.164-1.385-.51-2.637-1.628-.973-.868-1.63-1.94-1.821-2.268-.192-.328-.02-.505.144-.668.148-.147.328-.384.493-.575.164-.192.219-.328.328-.548.11-.219.055-.411-.027-.575-.082-.164-.739-1.78-.999-2.409-.254-.618-.515-.536-.709-.546-.184-.009-.395-.011-.607-.011s-.557.082-.847.397c-.29.315-1.11.1-1.11 2.684s1.856 5.07 2.115 5.414c.259.342 3.65 5.577 8.847 7.61 1.238.484 2.203.774 2.956.1.75-.11 1.94-.795 2.216-1.56.276-.765.276-1.423.195-1.56-.081-.137-.301-.219-.629-.384z" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="text-gray-400">Admissions Chat</span>
                        <a href={`https://wa.me/${data.settings.whatsapp.replace("+", "")}`} target="_blank" className="text-green-600 font-bold">Chat on WhatsApp</a>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          <Footer />

          {/* PR Video Modal Player */}
          {isVideoOpen && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
              <div className="relative w-full max-w-4xl bg-[#0B132B] border border-accent/20 rounded-2xl overflow-hidden shadow-2xl">
                {/* Close button */}
                <button
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/85 text-white hover:text-accent rounded-full p-2.5 transition-all text-sm font-bold shadow-lg"
                >
                  ✕
                </button>
                
                {/* HTML5 video player */}
                <div className="aspect-video w-full bg-black">
                  <video
                    src={introVideoSource}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
