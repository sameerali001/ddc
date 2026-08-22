const express = require("express");
const router = express.Router();
const { db } = require("../db");

// @route   GET api/public/data
// @desc    Get all public academy content for homepage
// @access  Public
router.get("/data", async (req, res) => {
  try {
    const [
      hero,
      about,
      courses,
      faculty,
      gallery,
      testimonials,
      students,
      blogs,
      settings
    ] = await Promise.all([
      db.getHero(),
      db.getAbout(),
      db.getCourses(),
      db.getFaculty(),
      db.getGallery(),
      db.getTestimonials(),
      db.getStudents(),
      db.getBlogs(),
      db.getSettings()
    ]);

    res.json({
      hero,
      about,
      courses,
      faculty,
      gallery,
      testimonials,
      students,
      blogs,
      settings
    });
  } catch (err) {
    console.error("Error fetching public data:", err.message);
    res.status(500).json({ error: "Failed to load academy content" });
  }
});

module.exports = router;
