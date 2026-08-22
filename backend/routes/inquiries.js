const express = require("express");
const router = express.Router();
const { db } = require("../db");
const authMiddleware = require("../middleware/auth");

// @route   POST api/inquiries
// @desc    Submit a contact/admission inquiry
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, phone, course, message } = req.body;

  if (!name || !email || !phone || !course) {
    return res.status(400).json({ msg: "Please enter all required fields" });
  }

  try {
    const newInquiry = await db.addInquiry({
      name,
      email,
      phone,
      course,
      message: message || ""
    });
    res.status(201).json({ msg: "Inquiry submitted successfully", inquiry: newInquiry });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/inquiries
// @desc    Get all inquiries (Admin only)
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const inquiries = await db.getInquiries();
    res.json(inquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/inquiries/:id
// @desc    Delete an inquiry (Admin only)
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await db.deleteInquiry(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
