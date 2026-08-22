const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const FALLBACK_DIR = path.join(__dirname, "db_fallback");

// Initialize Fallback Directory
if (!fs.existsSync(FALLBACK_DIR)) {
  fs.mkdirSync(FALLBACK_DIR, { recursive: true });
}

let isFallbackMode = false;

// Connect to MongoDB
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/doon_defence";
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("SUCCESS: Connected to MongoDB.");
    isFallbackMode = false;
  } catch (err) {
    console.warn("MongoDB connection failed. Switching to Local JSON Database Fallback.");
    console.warn("Reason:", err.message);
    isFallbackMode = true;
  }
};

// Seed helper for Local DB Fallback
const readLocalJSON = (filename, defaultVal = []) => {
  const filePath = path.join(FALLBACK_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), "utf8");
    return defaultVal;
  }
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return defaultVal;
  }
};

const writeLocalJSON = (filename, data) => {
  const filePath = path.join(FALLBACK_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Default Seeds
const defaultHero = {
  academyName: "DOON DEFENCE COLLEGE",
  tagline: "WHERE DISCIPLINE MEETS DESTINY",
  description: "India's premier defence training academy. Empowering NDA, CDS, AFCAT, and SSB aspirants through world-class academic preparation, rigorous physical training, and character development.",
  ctaPrimaryText: "Apply Now",
  ctaSecondaryText: "Download Brochure"
};

const defaultAbout = {
  mission: "To nurture and guide young patriots, instilling core military values of integrity, loyalty, and courage, and ensuring they excel both academically and physically to lead the Indian Armed Forces.",
  vision: "To be recognized globally as the ultimate nurturing ground for future defence leaders, combining top-class education, premium physical conditioning, and leadership training.",
  directorMessage: "At Doon Defence College, we don't just train students to pass exams. We build their character, physical endurance, and intellectual edge to ensure they stand tall as future commanders of India's Army, Navy, and Air Force.",
  directorName: "Brig. (Retd.) S. P. Rawat",
  directorTitle: "Managing Director, Doon Defence College",
  stats: [
    { label: "Selections", value: "2,500+" },
    { label: "Expert Officers", value: "15+" },
    { label: "Hostel Students", value: "600+" },
    { label: "Success Rate", value: "85%" }
  ]
};

const defaultCourses = [
  { id: "c1", title: "NDA (National Defence Academy)", duration: "1 Year / 2 Years", eligibility: "12th Pass / Appearing (16.5 - 19.5 yrs)", description: "Integrated academic schooling, GTO physical conditioning, SSB interview grooming, and weekly mock test patterns." },
  { id: "c2", title: "CDS (Combined Defence Services)", duration: "6 Months / 1 Year", eligibility: "Graduation (19 - 24 yrs)", description: "Specialized batch covering General Knowledge, English, and Mathematics with SSB interview guidance by retired board officers." },
  { id: "c3", title: "AFCAT (Air Force Common Admission Test)", duration: "6 Months", eligibility: "Graduation (20 - 24 yrs)", description: "Focused guidance for Air Force aspirants with cockpit training modules, simulator insights, and AFSB preparation." },
  { id: "c4", title: "SSB Interview (Service Selection Board)", duration: "14 Days / 1 Month", eligibility: "NDA/CDS Written Qualified / Direct Entry", description: "Rigorous psychological profiling, indoor GTO tasks, individual obstacles, and individual interviews by assessors." }
];

const defaultFaculty = [
  { id: "f1", name: "Brig. S. P. Rawat", role: "Director & SSB Head Interviewer", qualification: "Ex-President SSB Board, 35 Yrs Service", subject: "Personality Assessment & Interview Strategy" },
  { id: "f2", name: "Col. Rajesh Gupta", role: "Senior GTO Instructor", qualification: "Ex-GTO Officer 11 SSB, 28 Yrs Service", subject: "Group Tasks & Outdoor Obstacles" },
  { id: "f3", name: "Dr. Vikram Aditya", role: "Head of Academics", qualification: "PhD in Mathematics, Ex-NDA Professor", subject: "NDA Written Syllabus & Analytical Aptitude" }
];

const defaultGallery = [
  { id: "g1", title: "Morning Drill", category: "PT", image: "/gallery/drill.jpg" },
  { id: "g2", title: "Classroom Session", category: "Classroom", image: "/gallery/class.jpg" },
  { id: "g3", title: "Hostel Mess", category: "Hostel", image: "/gallery/hostel.jpg" }
];

const defaultTestimonials = [
  { id: "t1", studentName: "Cadet Aman Thapa", parentName: "Subedar Major Thapa", review: "Doon Defence College completely changed my outlook towards discipline. The teachers break down math concepts, and the GTO training grounds are identical to the actual SSB board.", rating: 5 },
  { id: "t2", studentName: "Lt. Pooja Negi", parentName: "Mrs. Savitri Negi", review: "The academic rigor combined with daily physical sessions enabled me to clear CDS on my first attempt. Teachers were available 24/7 in the library for doubts.", rating: 5 }
];

const defaultSuccessStories = [
  { id: "s1", cadetName: "Rohit Sen", rank: "NDA 151 Course", selectionYear: "2025", achievement: "Air Force Cadet", quote: "Dream big, prepare hard, and let Doon Defence College guide your wings." },
  { id: "s2", cadetName: "Anjali Joshi", rank: "OTA Chennai (CDS Entry)", selectionYear: "2026", achievement: "Lieutenant (Army)", quote: "The mock interviews and SSB psychology feedback here shaped my military mindset." }
];

const defaultBlogs = [
  { id: "b1", title: "How to Clear NDA Written Exam on First Attempt", category: "NDA Preparation", summary: "Expert strategies on structuring your mathematics and General Ability Test studies, time management, and mock test routines.", author: "Dr. Vikram Aditya", date: "June 20, 2026", content: "To clear the NDA written examination, consistency is key. First, ensure you have command over the class 11th and 12th syllabus of Mathematics. Secondly, create a strong vocabulary and read current affairs daily..." },
  { id: "b2", title: "SSB GTO Tasks: The Golden Rules to Stand Out", category: "SSB Tips", summary: "Learn what the GTO looks for in candidates during group discussion, progressive group task, and command tasks.", author: "Col. Rajesh Gupta", date: "June 25, 2026", content: "The Group Testing Officer (GTO) evaluates your social adaptability, cooperation, and group skills. In tasks like the PGT or HGT, focus on practical solutions instead of dominating others. Work with the team..." }
];

const defaultSettings = {
  seoTitle: "Doon Defence College | India's Top Defence Academy",
  seoMetaDescription: "Professional Defence Coaching Institute providing premium academic prep and SSB training in Dehradun.",
  whatsapp: "+919876543210",
  phone: "+911352458899",
  email: "admissions@doondefencecollege.in",
  address: "Premium Campus, Rajpur Road, Dehradun, Uttarakhand, Pin-248001"
};

// Database Repository Wrapper
const db = {
  isFallback: () => isFallbackMode,

  // Users (Admin login)
  getUsers: () => {
    if (isFallbackMode) return readLocalJSON("users", []);
    // Standard Mongoose query (handled by routes inline or helpers)
  },
  saveUsers: (users) => {
    if (isFallbackMode) writeLocalJSON("users", users);
  },

  // Hero Section
  getHero: async () => {
    if (isFallbackMode) return readLocalJSON("hero", defaultHero);
    const model = mongoose.models.Hero || mongoose.model("Hero", new mongoose.Schema(Object.keys(defaultHero).reduce((a,c)=>({...a, [c]: String}), {})));
    let record = await model.findOne();
    if (!record) {
      record = await model.create(defaultHero);
    }
    return record;
  },
  updateHero: async (data) => {
    if (isFallbackMode) {
      writeLocalJSON("hero", data);
      return data;
    }
    const model = mongoose.models.Hero;
    return await model.findOneAndUpdate({}, data, { new: true, upsert: true });
  },

  // About Section
  getAbout: async () => {
    if (isFallbackMode) return readLocalJSON("about", defaultAbout);
    const model = mongoose.models.About || mongoose.model("About", new mongoose.Schema({
      mission: String,
      vision: String,
      directorMessage: String,
      directorName: String,
      directorTitle: String,
      stats: [{ label: String, value: String }]
    }));
    let record = await model.findOne();
    if (!record) {
      record = await model.create(defaultAbout);
    }
    return record;
  },
  updateAbout: async (data) => {
    if (isFallbackMode) {
      writeLocalJSON("about", data);
      return data;
    }
    const model = mongoose.models.About;
    return await model.findOneAndUpdate({}, data, { new: true, upsert: true });
  },

  // Courses
  getCourses: async () => {
    if (isFallbackMode) return readLocalJSON("courses", defaultCourses);
    const model = mongoose.models.Course || mongoose.model("Course", new mongoose.Schema({
      title: String, duration: String, eligibility: String, description: String
    }));
    let list = await model.find();
    if (list.length === 0) {
      await model.insertMany(defaultCourses.map(({id, ...rest}) => rest));
      list = await model.find();
    }
    return list;
  },
  addCourse: async (data) => {
    if (isFallbackMode) {
      const courses = readLocalJSON("courses", defaultCourses);
      const newCourse = { id: `c-${Date.now()}`, ...data };
      courses.push(newCourse);
      writeLocalJSON("courses", courses);
      return newCourse;
    }
    const model = mongoose.models.Course;
    return await model.create(data);
  },
  updateCourse: async (id, data) => {
    if (isFallbackMode) {
      let courses = readLocalJSON("courses", defaultCourses);
      courses = courses.map(c => c.id === id ? { ...c, ...data } : c);
      writeLocalJSON("courses", courses);
      return { id, ...data };
    }
    const model = mongoose.models.Course;
    return await model.findByIdAndUpdate(id, data, { new: true });
  },
  deleteCourse: async (id) => {
    if (isFallbackMode) {
      let courses = readLocalJSON("courses", defaultCourses);
      courses = courses.filter(c => c.id !== id);
      writeLocalJSON("courses", courses);
      return { success: true };
    }
    const model = mongoose.models.Course;
    await model.findByIdAndDelete(id);
    return { success: true };
  },

  // Faculty
  getFaculty: async () => {
    if (isFallbackMode) return readLocalJSON("faculty", defaultFaculty);
    const model = mongoose.models.Faculty || mongoose.model("Faculty", new mongoose.Schema({
      name: String, role: String, qualification: String, subject: String, image: String
    }));
    let list = await model.find();
    if (list.length === 0) {
      await model.insertMany(defaultFaculty.map(({id, ...rest}) => rest));
      list = await model.find();
    }
    return list;
  },
  addFaculty: async (data) => {
    if (isFallbackMode) {
      const list = readLocalJSON("faculty", defaultFaculty);
      const item = { id: `f-${Date.now()}`, ...data };
      list.push(item);
      writeLocalJSON("faculty", list);
      return item;
    }
    const model = mongoose.models.Faculty;
    return await model.create(data);
  },
  updateFaculty: async (id, data) => {
    if (isFallbackMode) {
      let list = readLocalJSON("faculty", defaultFaculty);
      list = list.map(item => item.id === id ? { ...item, ...data } : item);
      writeLocalJSON("faculty", list);
      return { id, ...data };
    }
    const model = mongoose.models.Faculty;
    return await model.findByIdAndUpdate(id, data, { new: true });
  },
  deleteFaculty: async (id) => {
    if (isFallbackMode) {
      let list = readLocalJSON("faculty", defaultFaculty);
      list = list.filter(item => item.id !== id);
      writeLocalJSON("faculty", list);
      return { success: true };
    }
    const model = mongoose.models.Faculty;
    await model.findByIdAndDelete(id);
    return { success: true };
  },

  // Gallery
  getGallery: async () => {
    if (isFallbackMode) return readLocalJSON("gallery", defaultGallery);
    const model = mongoose.models.Gallery || mongoose.model("Gallery", new mongoose.Schema({
      title: String, category: String, image: String
    }));
    let list = await model.find();
    if (list.length === 0) {
      await model.insertMany(defaultGallery.map(({id, ...rest}) => rest));
      list = await model.find();
    }
    return list;
  },
  addGallery: async (data) => {
    if (isFallbackMode) {
      const list = readLocalJSON("gallery", defaultGallery);
      const item = { id: `g-${Date.now()}`, ...data };
      list.push(item);
      writeLocalJSON("gallery", list);
      return item;
    }
    const model = mongoose.models.Gallery;
    return await model.create(data);
  },
  deleteGallery: async (id) => {
    if (isFallbackMode) {
      let list = readLocalJSON("gallery", defaultGallery);
      list = list.filter(item => item.id !== id);
      writeLocalJSON("gallery", list);
      return { success: true };
    }
    const model = mongoose.models.Gallery;
    await model.findByIdAndDelete(id);
    return { success: true };
  },

  // Testimonials
  getTestimonials: async () => {
    if (isFallbackMode) return readLocalJSON("testimonials", defaultTestimonials);
    const model = mongoose.models.Testimonial || mongoose.model("Testimonial", new mongoose.Schema({
      studentName: String, parentName: String, review: String, rating: Number, image: String
    }));
    let list = await model.find();
    if (list.length === 0) {
      await model.insertMany(defaultTestimonials.map(({id, ...rest}) => rest));
      list = await model.find();
    }
    return list;
  },
  addTestimonial: async (data) => {
    if (isFallbackMode) {
      const list = readLocalJSON("testimonials", defaultTestimonials);
      const item = { id: `t-${Date.now()}`, ...data };
      list.push(item);
      writeLocalJSON("testimonials", list);
      return item;
    }
    const model = mongoose.models.Testimonial;
    return await model.create(data);
  },
  deleteTestimonial: async (id) => {
    if (isFallbackMode) {
      let list = readLocalJSON("testimonials", defaultTestimonials);
      list = list.filter(item => item.id !== id);
      writeLocalJSON("testimonials", list);
      return { success: true };
    }
    const model = mongoose.models.Testimonial;
    await model.findByIdAndDelete(id);
    return { success: true };
  },

  // Success Stories (Students)
  getStudents: async () => {
    if (isFallbackMode) return readLocalJSON("students", defaultSuccessStories);
    const model = mongoose.models.Student || mongoose.model("Student", new mongoose.Schema({
      cadetName: String, rank: String, selectionYear: String, achievement: String, quote: String, image: String
    }));
    let list = await model.find();
    if (list.length === 0) {
      await model.insertMany(defaultSuccessStories.map(({id, ...rest}) => rest));
      list = await model.find();
    }
    return list;
  },
  addStudent: async (data) => {
    if (isFallbackMode) {
      const list = readLocalJSON("students", defaultSuccessStories);
      const item = { id: `s-${Date.now()}`, ...data };
      list.push(item);
      writeLocalJSON("students", list);
      return item;
    }
    const model = mongoose.models.Student;
    return await model.create(data);
  },
  deleteStudent: async (id) => {
    if (isFallbackMode) {
      let list = readLocalJSON("students", defaultSuccessStories);
      list = list.filter(item => item.id !== id);
      writeLocalJSON("students", list);
      return { success: true };
    }
    const model = mongoose.models.Student;
    await model.findByIdAndDelete(id);
    return { success: true };
  },

  // Blogs
  getBlogs: async () => {
    if (isFallbackMode) return readLocalJSON("blogs", defaultBlogs);
    const model = mongoose.models.Blog || mongoose.model("Blog", new mongoose.Schema({
      title: String, category: String, summary: String, author: String, date: String, content: String, image: String
    }));
    let list = await model.find();
    if (list.length === 0) {
      await model.insertMany(defaultBlogs.map(({id, ...rest}) => rest));
      list = await model.find();
    }
    return list;
  },
  addBlog: async (data) => {
    if (isFallbackMode) {
      const list = readLocalJSON("blogs", defaultBlogs);
      const item = { id: `b-${Date.now()}`, date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), ...data };
      list.push(item);
      writeLocalJSON("blogs", list);
      return item;
    }
    const model = mongoose.models.Blog;
    return await model.create({
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      ...data
    });
  },
  updateBlog: async (id, data) => {
    if (isFallbackMode) {
      let list = readLocalJSON("blogs", defaultBlogs);
      list = list.map(item => item.id === id ? { ...item, ...data } : item);
      writeLocalJSON("blogs", list);
      return { id, ...data };
    }
    const model = mongoose.models.Blog;
    return await model.findByIdAndUpdate(id, data, { new: true });
  },
  deleteBlog: async (id) => {
    if (isFallbackMode) {
      let list = readLocalJSON("blogs", defaultBlogs);
      list = list.filter(item => item.id !== id);
      writeLocalJSON("blogs", list);
      return { success: true };
    }
    const model = mongoose.models.Blog;
    await model.findByIdAndDelete(id);
    return { success: true };
  },

  // Inquiries
  getInquiries: async () => {
    if (isFallbackMode) return readLocalJSON("inquiries", []);
    const model = mongoose.models.Inquiry || mongoose.model("Inquiry", new mongoose.Schema({
      name: String, email: String, phone: String, course: String, message: String, createdAt: { type: Date, default: Date.now }
    }));
    return await model.find().sort({ createdAt: -1 });
  },
  addInquiry: async (data) => {
    if (isFallbackMode) {
      const list = readLocalJSON("inquiries", []);
      const item = { id: `i-${Date.now()}`, createdAt: new Date().toISOString(), ...data };
      list.unshift(item);
      writeLocalJSON("inquiries", list);
      return item;
    }
    const model = mongoose.models.Inquiry || mongoose.model("Inquiry", new mongoose.Schema({
      name: String, email: String, phone: String, course: String, message: String, createdAt: { type: Date, default: Date.now }
    }));
    return await model.create(data);
  },
  deleteInquiry: async (id) => {
    if (isFallbackMode) {
      let list = readLocalJSON("inquiries", []);
      list = list.filter(item => item.id !== id);
      writeLocalJSON("inquiries", list);
      return { success: true };
    }
    const model = mongoose.models.Inquiry;
    await model.findByIdAndDelete(id);
    return { success: true };
  },

  // Settings
  getSettings: async () => {
    if (isFallbackMode) return readLocalJSON("settings", defaultSettings);
    const model = mongoose.models.Setting || mongoose.model("Setting", new mongoose.Schema(Object.keys(defaultSettings).reduce((a,c)=>({...a, [c]: String}), {})));
    let record = await model.findOne();
    if (!record) {
      record = await model.create(defaultSettings);
    }
    return record;
  },
  updateSettings: async (data) => {
    if (isFallbackMode) {
      writeLocalJSON("settings", data);
      return data;
    }
    const model = mongoose.models.Setting;
    return await model.findOneAndUpdate({}, data, { new: true, upsert: true });
  }
};

module.exports = { connectDB, db };
