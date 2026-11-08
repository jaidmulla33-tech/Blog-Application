const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { read, write } = require("../utils/store");

const router = express.Router();
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e);
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required." });
  if (!emailOk(email))
    return res.status(400).json({ message: "Enter a valid email address." });
  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });

  const users = read("users");
  if (users.some((u) => u.email === email.toLowerCase()))
    return res
      .status(409)
      .json({ message: "This email is already registered. Log in instead." });

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
  };
  users.push(user);
  write("users", users);
  res.status(201).json({ message: "Account created.", user: publicUser(user) });
});

// POST /api/auth/login  (Module 5 will also return a JWT here)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const user = read("users").find((u) => u.email === email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Email or password is incorrect." });
  res.json({ message: "Login successful.", user: publicUser(user) });
});

module.exports = router;
