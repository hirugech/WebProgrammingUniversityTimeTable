console.log("Login JS is working");
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  console.log("login.js loaded");
  console.log("form is:", form);

  if (!form) {
    console.error("Could not find form with id 'loginForm'");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(" Login form submitted");

    const formData = new FormData(this);

    fetch("http://localhost:8000/api/login.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(" Response from server:", data);
        if (data.success) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userRole", data.userRole);
          if (data.courseId) {
            localStorage.setItem("courseId", data.courseId);
          }

          if (data.userRole === 'admin') {
            window.location.href = "../pages/adminDashboard.html";
          } else if (data.userRole === 'professor') {
            window.location.href = "../pages/professorDashboard.html";
          } else if (data.userRole === 'student') {
            window.location.href = "../pages/studentDashboard.html";
          }
        } else {
          alert("Login failed: " + data.message);
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        alert("Something went wrong. Check console.");
      });
  });
});
