const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "dehradun_defence_academy_super_secret_key_123";

// Helper to get or seed admin
async function getAdminUser(email) {
  let users = [];
  if (db.isFallback()) {
    users = db.getUsers();
    // Auto-seed admin if empty
    if (users.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      const admin = {
        id: "u-1",
        email: "admin@dehradundefence.com",
        password: hashedPassword,
        name: "Director Administrator"
      };
      users.push(admin);
      db.saveUsers(users);
    }
    return users.find(u => u.email === email);
  } else {
    const mongoose = require("mongoose");
    const UserSchema = new mongoose.Schema({
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      name: String
    });
    const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
    
    let user = await UserModel.findOne({ email });
    if (!user && email === "admin@dehradundefence.com") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      user = await UserModel.create({
        email: "admin@dehradundefence.com",
        password: hashedPassword,
        name: "Director Administrator"
      });
    }
    return user;
  }
}

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await getAdminUser(email);
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id || user._id,
        email: user.email,
        name: user.name
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id || user._id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/auth/me
// @desc    Get current user details from token
// @access  Private
const authMiddleware = require("../middleware/auth");
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await getAdminUser(req.user.email);
    if (!user) return res.status(404).json({ msg: "User not found" });
    
    res.json({
      id: user.id || user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
