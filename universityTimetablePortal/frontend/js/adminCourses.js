const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const addCourseForm = document.getElementById("addCourseForm");
  const updateCourseSection = document.getElementById("updateCourseSection");
  const updateCourseForm = document.getElementById("updateCourseForm");
  const courseList = document.getElementById("courseList");

  function fetchCourses() {
    fetch("http://localhost:8000/api/getCourses.php")
      .then(res => res.json())
      .then(data => {
        courseList.innerHTML = "";
        if (data.length === 0) {
          courseList.innerHTML = "<li>No courses found.</li>";
          return;
        }

        data.forEach(course => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${course.courseName}</strong> (Semester ${course.semester}, Year ${course.year})
            <button class="edit-course"
              data-id="${course.courseId}"
              data-name="${course.courseName}"
              data-semester="${course.semester}"
              data-year="${course.year}">
              Edit
            </button>
            <button class="delete-course red-btn" data-id="${course.courseId}">Delete</button>
          `;
          courseList.appendChild(li);
        });
      });
  }

  addCourseForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch("http://localhost:8000/api/addCourse.php", {
      method: "POST",
      body: new FormData(addCourseForm)
    })
      .then(res => res.json())
      .then(() => {
        addCourseForm.reset();
        fetchCourses();
      });
  });

  courseList.addEventListener("click", e => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("edit-course")) {
      updateCourseSection.style.display = "block";
      document.getElementById("updateCourseId").value = id;
      document.getElementById("updateCourseName").value = e.target.dataset.name;
      document.getElementById("updateSemester").value = e.target.dataset.semester;
      document.getElementById("updateYear").value = e.target.dataset.year;
    }

    if (e.target.classList.contains("delete-course")) {
      if (confirm("Are you sure you want to delete this course?")) {
        fetch("http://localhost:8000/api/deleteCourse.php", {
          method: "POST",
          body: new URLSearchParams({ courseId: id })
        })
          .then(res => res.json())
          .then(() => fetchCourses());
      }
    }
  });

  updateCourseForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(updateCourseForm);

    fetch("http://localhost:8000/api/updateCourse.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          updateCourseForm.reset();
          updateCourseSection.style.display = "none";
          fetchCourses();
        } else {
          alert("Update failed: " + data.message);
        }
      })
      .catch(err => {
        console.error("Update error:", err);
      });
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

  fetchCourses();
});
