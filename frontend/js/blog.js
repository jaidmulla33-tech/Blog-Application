// Blog list, dashboard and create form. Data lives in localStorage for now.
// Module 3: replace getBlogs/saveBlog with API calls to /api/blogs.
const sampleBlogs = [
  {
    id: 1,
    title: "Why I started learning full stack",
    category: "Career",
    author: "Inkwell Team",
    date: "2026-10-20",
    content:
      "Building one project end to end teaches more than ten tutorials. Start small and ship each stage.",
  },
  {
    id: 2,
    title: "HTML, CSS and JavaScript in one weekend",
    category: "Web",
    author: "Inkwell Team",
    date: "2026-10-27",
    content:
      "Learn semantic HTML first, then layout with flexbox and grid, and only then add JavaScript.",
  },
  {
    id: 3,
    title: "Git habits that save you later",
    category: "Tools",
    author: "Inkwell Team",
    date: "2026-11-02",
    content:
      "Commit small, write clear messages, and push often. Your future self will thank you.",
  },
];
const getBlogs = () =>
  JSON.parse(localStorage.getItem("blogs") || "null") || sampleBlogs;
const saveBlog = (blog) =>
  localStorage.setItem("blogs", JSON.stringify([blog, ...getBlogs()]));
const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const card = (
  b,
) => `<article class="post"><span class="tag">${esc(b.category)}</span>
  <h3>${esc(b.title)}</h3><p>${esc(b.content.slice(0, 110))}…</p>
  <p class="meta">${esc(b.author)} · ${b.date}</p></article>`;

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  const page = document.body.dataset.page;

  if ((page === "dashboard" || page === "create") && !user) {
    location.href = "login.html"; // Module 5 adds real route protection
    return;
  }

  if (page === "home")
    document.getElementById("blog-list").innerHTML = getBlogs()
      .map(card)
      .join("");

  if (page === "dashboard") {
    document.getElementById("welcome").textContent = `Welcome, ${user.name}`;
    const mine = getBlogs().filter((b) => b.author === user.name);
    document.getElementById("my-blogs").innerHTML = mine.length
      ? mine.map(card).join("")
      : `<div class="empty">You haven't written anything yet. <a href="create-blog.html">Write your first blog</a>.</div>`;
  }

  const form = document.getElementById("blog-form");
  if (form)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const { title, category, content } = Object.fromEntries(
        new FormData(form),
      );
      saveBlog({
        id: Date.now(),
        title,
        category,
        content,
        author: user.name,
        date: new Date().toISOString().slice(0, 10),
      });
      showMsg(
        document.getElementById("msg"),
        "Blog published. Redirecting to dashboard…",
        "ok",
      );
      setTimeout(() => (location.href = "dashboard.html"), 800);
    });
});
