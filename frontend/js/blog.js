const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

async function fetchBlogs(query = "") {
  const res = await fetch(`${API_URL}/blogs${query}`);
  if (!res.ok) throw new Error();
  return res.json();
}

const card = (
  b,
) => `<article class="post"><span class="tag">${esc(b.category)}</span>
  <h3>${esc(b.title)}</h3><p>${esc(b.content.slice(0, 110))}${b.content.length > 110 ? "…" : ""}</p>
  <p class="meta">${esc(b.author)} · ${b.createdAt.slice(0, 10)}</p></article>`;

const serverDown = `<div class="empty">Cannot reach the server. Start the backend and refresh.</div>`;

document.addEventListener("DOMContentLoaded", async () => {
  const user = getUser();
  const page = document.body.dataset.page;

  if ((page === "dashboard" || page === "create") && !user) {
    location.href = "login.html"; // Module 5 adds real route protection
    return;
  }

  if (page === "home") {
    const box = document.getElementById("blog-list");
    try {
      const blogs = await fetchBlogs();
      box.innerHTML = blogs.length
        ? blogs.map(card).join("")
        : `<div class="empty">No blogs yet. Be the first to write one.</div>`;
    } catch {
      box.innerHTML = serverDown;
    }
  }

  if (page === "dashboard") {
    document.getElementById("welcome").textContent = `Welcome, ${user.name}`;
    const box = document.getElementById("my-blogs");
    try {
      const mine = await fetchBlogs(`?authorId=${user.id}`);
      box.innerHTML = mine.length
        ? mine.map(card).join("")
        : `<div class="empty">You haven't written anything yet. <a href="create-blog.html">Write your first blog</a>.</div>`;
    } catch {
      box.innerHTML = serverDown;
    }
  }

  const form = document.getElementById("blog-form");
  if (form)
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = document.getElementById("msg");
      try {
        const res = await fetch(`${API_URL}/blogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...Object.fromEntries(new FormData(form)),
            authorId: user.id,
          }),
        });
        const data = await res.json();
        if (!res.ok) return showMsg(msg, data.message, "err");
        showMsg(msg, "Blog published. Redirecting to dashboard…", "ok");
        setTimeout(() => (location.href = "dashboard.html"), 800);
      } catch {
        showMsg(msg, "Cannot reach the server. Is the backend running?", "err");
      }
    });
});
