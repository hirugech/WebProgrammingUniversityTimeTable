
const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const addSubjectForm = document.getElementById("addSubjectForm");
  const courseSelect = document.getElementById("courseSelect");
  const subjectList = document.getElementById("subjectList");

  const fetchCourses = () => {
    fetch("http://localhost:8000/api/getCourses.php")
      .then(res => res.json())
      .then(data => {
        courseSelect.innerHTML = '<option value=""> Select Course </option>';
        data.forEach(course => {
          const option = document.createElement("option");
          option.value = course.courseId;
          option.textContent = `${course.courseName} (Semester ${course.semester}, ${course.year})`;
          courseSelect.appendChild(option);
        });
      });
  };

 
  const fetchSubjects = () => {
    fetch("http://localhost:8000/api/getSubjects.php")
      .then(res => res.json())
      .then(data => {
        subjectList.innerHTML = "";
        if (data.length === 0) {
          subjectList.innerHTML = "<li>No subjects found.</li>";
          return;
        }
        data.forEach(subject => {
          const li = document.createElement("li");
          li.innerHTML = `
            ${subject.subjectName} — <em>${subject.courseName}</em>
            <button class="delete-subject red-btn" data-id="${subject.subjectId}">Delete</button>
          `;
          subjectList.appendChild(li);
        });
      });
  };

  addSubjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addSubjectForm);
    fetch("http://localhost:8000/api/addSubject.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        addSubjectForm.reset();
        fetchSubjects();
      });
  });

  subjectList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-subject")) {
      const id = e.target.dataset.id;
      fetch("http://localhost:8000/api/deleteSubject.php", {
        method: "POST",
        body: new URLSearchParams({ subjectId: id })
      })
        .then(res => res.json())
        .then(() => fetchSubjects());
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

 
  fetchCourses();
  fetchSubjects();
});
