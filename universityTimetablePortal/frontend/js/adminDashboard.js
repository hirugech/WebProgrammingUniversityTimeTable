

const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const fullName = localStorage.getItem("fullName") || "Unknown";
  const email = localStorage.getItem("email") || "Unknown";

  const nameEl = document.getElementById("adminName");
  const emailEl = document.getElementById("adminEmail");

  if (nameEl) nameEl.textContent = fullName;
  if (emailEl) emailEl.textContent = email;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });
});
