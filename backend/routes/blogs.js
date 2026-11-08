const express = require("express");
const crypto = require("crypto");
const { read, write } = require("../utils/store");

const router = express.Router();

// GET /api/blogs  (optional ?authorId= to get one user's blogs)
router.get("/", (req, res) => {
  let blogs = read("blogs");
  if (req.query.authorId)
    blogs = blogs.filter((b) => b.authorId === req.query.authorId);
  res.json(blogs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

// POST /api/blogs  (Module 5 will take the author from the JWT instead of the body)
router.post("/", (req, res) => {
  const { title, category, content, authorId } = req.body;
  if (!title || !content || !authorId)
    return res
      .status(400)
      .json({ message: "Title, content and author are required." });
  const author = read("users").find((u) => u.id === authorId);
  if (!author)
    return res.status(404).json({ message: "Author not found. Log in again." });

  const blog = {
    id: crypto.randomUUID(),
    title: title.trim(),
    category: category || "Other",
    content: content.trim(),
    authorId: author.id,
    author: author.name,
    createdAt: new Date().toISOString(),
  };
  const blogs = read("blogs");
  blogs.push(blog);
  write("blogs", blogs);
  res.status(201).json({ message: "Blog published.", blog });
});

module.exports = router;
