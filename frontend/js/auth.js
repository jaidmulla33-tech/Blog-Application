async function postJSON(path, body) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { ok: res.ok, data: await res.json() };
  } catch {
    return {
      ok: false,
      data: { message: "Cannot reach the server. Is the backend running?" },
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const msg = document.getElementById("msg");

  const reg = document.getElementById("register-form");
  if (reg)
    reg.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { ok, data } = await postJSON(
        "/auth/register",
        Object.fromEntries(new FormData(reg)),
      );
      if (!ok) return showMsg(msg, data.message, "err");
      showMsg(msg, "Account created. Redirecting to log in…", "ok");
      setTimeout(() => (location.href = "login.html"), 900);
    });

  const login = document.getElementById("login-form");
  if (login)
    login.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { ok, data } = await postJSON(
        "/auth/login",
        Object.fromEntries(new FormData(login)),
      );
      if (!ok) return showMsg(msg, data.message, "err");
      localStorage.setItem("user", JSON.stringify(data.user)); // { id, name, email }
      location.href = "dashboard.html";
    });
});
