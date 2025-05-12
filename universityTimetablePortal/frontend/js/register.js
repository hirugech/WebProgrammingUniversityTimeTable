document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const courseSelect = document.getElementById("courseSelect");

  fetch("http://localhost:8000/api/getCourses.php")
    .then(res => res.json())
    .then(courses => {
      if (!Array.isArray(courses)) {
        throw new Error("Invalid course data");
      }

      courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.courseId;
        option.textContent = `${course.courseName} (Year ${course.year})`;
        courseSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Failed to load courses:", err);
      alert("Could not load courses. Please try again later.");
    });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("http://localhost:8000/api/register.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(" Registered successfully! Please log in.");
          window.location.href = "../pages/login.html";
        } else {
          alert(" Registration failed: " + data.message);
        }
      })
      .catch(error => {
        console.error(" Error during registration:", error);
        alert("Something went wrong. Please try again.");
      });
  });
});
