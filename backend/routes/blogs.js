const express = require("express");
const crypto = require("crypto");
const { read, write } = require("../utils/store");

const router = express.Router();

router.get("/", (req, res) => {
  let blogs = read("blogs");
  if (req.query.authorId)
    blogs = blogs.filter((b) => b.authorId === req.query.authorId);
  res.json(blogs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});


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
