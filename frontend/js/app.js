const API_URL = "http://localhost:5000/api";
const getUser = () => JSON.parse(localStorage.getItem("user") || "null");
const showMsg = (el, text, type) => {
  el.textContent = text;
  el.className = "msg " + type;
};

function renderLayout() {
  const page = document.body.dataset.page,
    user = getUser();
  const link = (href, key, label) =>
    `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`;
  const auth = user
    ? `${link("dashboard.html", "dashboard", "Dashboard")}${link("create-blog.html", "create", "Create blog")}<a href="#" id="logout">Log out</a>`
    : `${link("login.html", "login", "Log in")}<a class="btn" href="register.html">Sign up</a>`;
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <header class="nav"><div class="nav-in">
      <a class="logo" href="index.html">Inkwell</a>
      <button class="menu-btn" id="menu-btn" aria-label="Toggle menu">☰</button>
      <nav class="links" id="links">${link("index.html", "home", "Home")}${auth}</nav>
    </div></header>`,
  );
  document.body.insertAdjacentHTML(
    "beforeend",
    `<footer>© 2026 Inkwell · Built during the Codomax internship</footer>`,
  );
  document.getElementById("menu-btn").onclick = () =>
    document.getElementById("links").classList.toggle("open");
  const out = document.getElementById("logout");
  if (out)
    out.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      location.href = "index.html";
    };
}
document.addEventListener("DOMContentLoaded", renderLayout);
