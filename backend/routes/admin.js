const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { db } = require("../db");
const authMiddleware = require("../middleware/auth");

const UPLOAD_ROOT = path.join(__dirname, "../uploads");

// Ensure upload subdirectories exist
const subfolders = [
  "hero",
  "faculty",
  "courses",
  "gallery",
  "testimonials",
  "blogs",
  "students"
];
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}
subfolders.forEach(sf => {
  const dir = path.join(UPLOAD_ROOT, sf);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine folder from query parameter, e.g. /upload?folder=faculty
    const folder = req.query.folder || "general";
    const dest = path.join(UPLOAD_ROOT, folder);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed (jpg, jpeg, png, webp, gif)"));
  }
});

// Protect all admin routes
router.use(authMiddleware);

// @route   POST api/admin/upload
// @desc    Upload an image locally
// @access  Private
router.post("/upload", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }
    
    // Return relative URL for web client
    const folder = req.query.folder || "general";
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;
    res.json({ url: fileUrl });
  });
});

// --- CMS CRUD Endpoints ---

// HERO
router.put("/hero", async (req, res) => {
  try {
    const updated = await db.updateHero(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ABOUT
router.put("/about", async (req, res) => {
  try {
    const updated = await db.updateAbout(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// COURSES
router.post("/courses", async (req, res) => {
  try {
    const item = await db.addCourse(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/courses/:id", async (req, res) => {
  try {
    const updated = await db.updateCourse(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/courses/:id", async (req, res) => {
  try {
    const result = await db.deleteCourse(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FACULTY
router.post("/faculty", async (req, res) => {
  try {
    const item = await db.addFaculty(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/faculty/:id", async (req, res) => {
  try {
    const updated = await db.updateFaculty(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/faculty/:id", async (req, res) => {
  try {
    const result = await db.deleteFaculty(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GALLERY
router.post("/gallery", async (req, res) => {
  try {
    const item = await db.addGallery(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/gallery/:id", async (req, res) => {
  try {
    const result = await db.deleteGallery(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TESTIMONIALS
router.post("/testimonials", async (req, res) => {
  try {
    const item = await db.addTestimonial(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/testimonials/:id", async (req, res) => {
  try {
    const result = await db.deleteTestimonial(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STUDENTS (Success Stories)
router.post("/students", async (req, res) => {
  try {
    const item = await db.addStudent(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/students/:id", async (req, res) => {
  try {
    const result = await db.deleteStudent(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BLOGS
router.post("/blogs", async (req, res) => {
  try {
    const item = await db.addBlog(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/blogs/:id", async (req, res) => {
  try {
    const updated = await db.updateBlog(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    const result = await db.deleteBlog(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SETTINGS
router.put("/settings", async (req, res) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
