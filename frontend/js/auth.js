document.addEventListener("DOMContentLoaded", () => {
  const msg = document.getElementById("msg");

  const reg = document.getElementById("register-form");
  if (reg)
    reg.addEventListener("submit", (e) => {
      e.preventDefault();
      const { name, email, password } = Object.fromEntries(new FormData(reg));
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u) => u.email === email))
        return showMsg(
          msg,
          "This email is already registered. Log in instead.",
          "err",
        );
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      showMsg(msg, "Account created. Redirecting to log in…", "ok");
      setTimeout(() => (location.href = "login.html"), 900);
    });

  const login = document.getElementById("login-form");
  if (login)
    login.addEventListener("submit", (e) => {
      e.preventDefault();
      const { email, password } = Object.fromEntries(new FormData(login));
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const found = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!found) return showMsg(msg, "Email or password is incorrect.", "err");
      localStorage.setItem(
        "user",
        JSON.stringify({ name: found.name, email: found.email }),
      );
      location.href = "dashboard.html";
    });
});
