"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield, Key, LayoutDashboard, Settings as SettingsIcon, BookOpen, Users,
  Image as ImageIcon, Award, FileText, Mail, LogOut, CheckCircle, Trash2, Plus, Info, RefreshCw
} from "lucide-react";

export default function AdminPage() {
  // Authentication states
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "admin@doondefence.com", password: "admin123" });
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Dynamic Data States
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [settings, setSettings] = useState({ seoTitle: "", seoMetaDescription: "", phone: "", email: "", address: "" });
  
  // CMS Form States
  const [newCourse, setNewCourse] = useState({ title: "", duration: "", eligibility: "", description: "" });
  const [newFaculty, setNewFaculty] = useState({ name: "", role: "", qualification: "", subject: "" });
  const [newBlog, setNewBlog] = useState({ title: "", category: "NDA Preparation", summary: "", author: "Admin", content: "" });
  
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Fetch admin content upon authentication
  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const fetchAdminData = async () => {
    try {
      // Fetch inquiries
      let res = await fetch(`${API_URL}/api/inquiries`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const list = await res.json();
        setInquiries(list);
      }

      // Fetch public collections for CMS tables
      res = await fetch(`${API_URL}/api/public/data`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
        setFaculty(data.faculty || []);
        setBlogs(data.blogs || []);
        setSettings(data.settings || { seoTitle: "", seoMetaDescription: "", phone: "", email: "", address: "" });
        setIsDemoMode(false);
      }
    } catch (e) {
      console.warn("Express server offline. Activating CMS Sandbox Demo Mode.");
      setIsDemoMode(true);
      // Pre-seed demo structures if offline
      setInquiries([
        { id: "i1", name: "Vikram Negi", email: "vikram@gmail.com", phone: "+91 9998887770", course: "NDA (National Defence Academy)", message: "Request info regarding 1-year batch starting July." },
        { id: "i2", name: "Sneha Rawat", email: "sneha@yahoo.com", phone: "+91 8887776665", course: "SSB Interview Grooming", message: "Do you provide girls hostel boarding?" }
      ]);
      setCourses([
        { id: "c1", title: "NDA (National Defence Academy)", duration: "1 Year / 2 Years", eligibility: "12th Pass", description: "Integrated schooling & PT." }
      ]);
      setFaculty([
        { id: "f1", name: "Brig. S. P. Rawat", role: "SSB Head Interviewer", qualification: "Ex President SSB", subject: "Personality Assessment" }
      ]);
      setBlogs([
        { id: "b1", title: "How to Clear NDA Written Exam on First Attempt", category: "NDA Prep", summary: "Expert tips.", author: "Dr. Vikram Aditya", date: "June 20, 2026" }
      ]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
      } else {
        setAuthError(data.msg || "Invalid Credentials");
      }
    } catch (err) {
      // Demo authentication mode bypass
      if (loginForm.email === "admin@doondefence.com" && loginForm.password === "admin123") {
        const dummyToken = "demo-sandbox-token-xyz";
        localStorage.setItem("adminToken", dummyToken);
        setToken(dummyToken);
        setIsDemoMode(true);
        fetchAdminData();
      } else {
        setAuthError("Offline: Please log in using credentials admin@doondefence.com / admin123");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  // CMS: Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (isDemoMode) {
      setInquiries(inquiries.filter(i => i.id !== id));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/inquiries/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setInquiries(inquiries.filter(i => i._id !== id && i.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CMS: Add Course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    if (isDemoMode) {
      const added = { id: `c-${Date.now()}`, ...newCourse };
      setCourses([...courses, added]);
      setNewCourse({ title: "", duration: "", eligibility: "", description: "" });
      setStatusMessage("Course added to demo state!");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        const item = await res.json();
        setCourses([...courses, item]);
        setNewCourse({ title: "", duration: "", eligibility: "", description: "" });
        setStatusMessage("Course successfully created on database.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CMS: Add Faculty
  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    if (isDemoMode) {
      const added = { id: `f-${Date.now()}`, ...newFaculty };
      setFaculty([...faculty, added]);
      setNewFaculty({ name: "", role: "", qualification: "", subject: "" });
      setStatusMessage("Faculty added to demo state!");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/faculty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newFaculty)
      });
      if (res.ok) {
        const item = await res.json();
        setFaculty([...faculty, item]);
        setNewFaculty({ name: "", role: "", qualification: "", subject: "" });
        setStatusMessage("Faculty profile successfully recorded.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CMS: Add Blog
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    if (isDemoMode) {
      const added = { id: `b-${Date.now()}`, date: new Date().toLocaleDateString(), ...newBlog };
      setBlogs([added, ...blogs]);
      setNewBlog({ title: "", category: "NDA Preparation", summary: "", author: "Admin", content: "" });
      setStatusMessage("Blog article added to demo state!");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newBlog)
      });
      if (res.ok) {
        const item = await res.json();
        setBlogs([item, ...blogs]);
        setNewBlog({ title: "", category: "NDA Preparation", summary: "", author: "Admin", content: "" });
        setStatusMessage("Blog article successfully published.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isClient) return null;

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen bg-[#050914] text-white flex flex-col justify-center items-center px-6 relative overflow-hidden">
        {/* Amber sunrise radial light in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#D4AF37]/10 to-transparent filter blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-md w-full dark-glass-panel p-8 rounded-2xl border border-accent/20 shadow-2xl relative z-10">
          <div className="flex flex-col items-center gap-3 mb-8 text-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-[#0B132B]" />
            </div>
            <h1 className="text-2xl font-bold font-display uppercase tracking-widest text-white">
              CMS Admin Access
            </h1>
            <p className="text-gray-400 text-xs tracking-wider uppercase">
              Doon Defence College Portal
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-accent">Administrator Email</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="px-4 py-3 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                placeholder="admin@doondefence.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-accent">Master Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="px-4 py-3 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="bg-accent hover:bg-accent-light text-[#0B132B] font-bold text-xs uppercase tracking-widest py-3.5 rounded mt-2 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              Verify Authority
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <Link href="/" className="text-xs text-gray-500 hover:text-accent transition-colors font-medium">
              ← Return to Academy Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CMS DASHBOARD LAYOUT
  return (
    <div className="min-h-screen bg-[#050914] text-white flex flex-col">
      {/* Top Banner */}
      <header className="bg-[#0b132b] border-b border-accent/20 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-base font-bold tracking-wider font-display uppercase">Doon Defence Admin</h1>
            {isDemoMode && (
              <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/20">
                Sandbox Demo Mode
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded transition-all"
        >
          <LogOut className="w-4 h-4 text-accent" />
          <span>Exit Panel</span>
        </button>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 bg-[#0B132B]/50 border-r border-white/5 p-6 flex flex-col gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4">Core CMS</span>
          {[
            { id: "dashboard", label: "Inquiries Log", icon: <Mail className="w-4 h-4" /> },
            { id: "courses", label: "Manage Courses", icon: <BookOpen className="w-4 h-4" /> },
            { id: "faculty", label: "Manage Faculty", icon: <Users className="w-4 h-4" /> },
            { id: "blogs", label: "Manage Blogs", icon: <FileText className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setStatusMessage("");
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-accent text-[#0B132B] shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {statusMessage && (
            <div className="mb-6 p-4 rounded bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* TAB 1: INQUIRIES LOG */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider text-accent">Student Inquiries Log</h2>
                <button
                  onClick={fetchAdminData}
                  className="p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                  title="Refresh Logs"
                >
                  <RefreshCw className="w-4 h-4 text-accent" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {inquiries.length === 0 ? (
                  <div className="dark-glass-panel p-8 rounded-xl text-center text-gray-500 text-xs uppercase tracking-wider">
                    No active admissions inquiries found.
                  </div>
                ) : (
                  inquiries.map((inq: any) => (
                    <div key={inq.id || inq._id} className="dark-glass-panel p-6 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex flex-col gap-1.5 text-xs text-gray-400">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white uppercase">{inq.name}</span>
                          <span className="bg-accent/10 text-accent font-bold uppercase tracking-wider px-2.5 py-0.5 rounded text-[9px] border border-accent/20">
                            {inq.course}
                          </span>
                        </div>
                        <span><strong>Phone / WhatsApp:</strong> {inq.phone}</span>
                        <span><strong>Email Address:</strong> {inq.email}</span>
                        <span><strong>Message Details:</strong> {inq.message || "(No message)"}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleDeleteInquiry(inq.id || inq._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2.5 rounded transition-all"
                          title="Delete Submission"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE COURSES */}
          {activeTab === "courses" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Col */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider text-accent">Create Course</h2>
                <form onSubmit={handleAddCourse} className="dark-glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Course Stream Name</label>
                    <input
                      type="text"
                      required
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="e.g. NDA Coaching"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Duration</label>
                    <input
                      type="text"
                      required
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="e.g. 1 Year Batch"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Eligibility Criteria</label>
                    <input
                      type="text"
                      required
                      value={newCourse.eligibility}
                      onChange={(e) => setNewCourse({ ...newCourse, eligibility: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="e.g. 12th Pass"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Detailed Description</label>
                    <textarea
                      rows={3}
                      required
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="Add syllabus details, scheduling drills..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-light text-[#0B132B] font-bold text-xs uppercase tracking-widest py-2.5 rounded transition-all mt-2"
                  >
                    Add Batch Stream
                  </button>
                </form>
              </div>

              {/* List Col */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider text-accent">Active Streams List</h2>
                <div className="flex flex-col gap-4">
                  {courses.length === 0 ? (
                    <div className="dark-glass-panel p-6 rounded-xl text-center text-gray-500 text-xs">
                      No active courses registered.
                    </div>
                  ) : (
                    courses.map((c: any) => (
                      <div key={c.id || c._id} className="dark-glass-panel p-5 rounded-xl border border-white/5 flex justify-between gap-4">
                        <div className="text-xs flex flex-col gap-1">
                          <span className="text-sm font-bold text-white uppercase">{c.title}</span>
                          <span className="text-gray-400">Duration: {c.duration} | Eligibility: {c.eligibility}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE FACULTY */}
          {activeTab === "faculty" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Col */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider text-accent">Register Faculty Profile</h2>
                <form onSubmit={handleAddFaculty} className="dark-glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Full Name (Military Rank prefix)</label>
                    <input
                      type="text"
                      required
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="e.g. Major General V. K. Sharma"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Designation / Role</label>
                    <input
                      type="text"
                      required
                      value={newFaculty.role}
                      onChange={(e) => setNewFaculty({ ...newFaculty, role: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="e.g. GTO Instructor"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Credentials / Commission history</label>
                    <input
                      type="text"
                      required
                      value={newFaculty.qualification}
                      onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="e.g. Ex-President 11 SSB"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Instruction Subjects</label>
                    <input
                      type="text"
                      required
                      value={newFaculty.subject}
                      onChange={(e) => setNewFaculty({ ...newFaculty, subject: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="e.g. Group Tasks & Personality groom"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-light text-[#0B132B] font-bold text-xs uppercase tracking-widest py-2.5 rounded transition-all mt-2"
                  >
                    Register Instructor
                  </button>
                </form>
              </div>

              {/* List Col */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider text-accent">Instructors Panel</h2>
                <div className="flex flex-col gap-4">
                  {faculty.map((f: any) => (
                    <div key={f.id || f._id} className="dark-glass-panel p-5 rounded-xl border border-white/5">
                      <div className="text-xs">
                        <span className="text-sm font-bold text-white uppercase block">{f.name}</span>
                        <span className="text-secondary font-semibold block mb-2">{f.role}</span>
                        <span className="text-gray-400 text-[11px]">Domain: {f.subject}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MANAGE BLOGS */}
          {activeTab === "blogs" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Col */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider text-accent">Publish Blog Post</h2>
                <form onSubmit={handleAddBlog} className="dark-glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Article Title</label>
                    <input
                      type="text"
                      required
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="e.g. SSB Psychology Test Tips"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Category</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-[#0b132b] border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                    >
                      <option>NDA Preparation</option>
                      <option>CDS Preparation</option>
                      <option>AFCAT preparation</option>
                      <option>SSB Tips</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Short Summary</label>
                    <input
                      type="text"
                      required
                      value={newBlog.summary}
                      onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="Add 1-sentence synopsis..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Author Name</label>
                    <input
                      type="text"
                      required
                      value={newBlog.author}
                      onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-accent">Full Article Body</label>
                    <textarea
                      rows={5}
                      required
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="px-3.5 py-2.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-accent text-white"
                      placeholder="Write blog content in text or markdown formats..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-light text-[#0B132B] font-bold text-xs uppercase tracking-widest py-2.5 rounded transition-all mt-2"
                  >
                    Publish Article
                  </button>
                </form>
              </div>

              {/* List Col */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <h2 className="text-xl font-bold font-display uppercase tracking-wider text-accent">Published Articles</h2>
                <div className="flex flex-col gap-4">
                  {blogs.map((b: any) => (
                    <div key={b.id || b._id} className="dark-glass-panel p-5 rounded-xl border border-white/5">
                      <div className="text-xs flex flex-col gap-1">
                        <span className="bg-secondary/20 text-accent text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded self-start">
                          {b.category}
                        </span>
                        <span className="text-sm font-bold text-white uppercase block mt-1">{b.title}</span>
                        <span className="text-gray-400 block text-[11px]">{b.summary}</span>
                        <span className="text-[10px] text-gray-500 mt-2 font-mono">Published by: {b.author} | {b.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
