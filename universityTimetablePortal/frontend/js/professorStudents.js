document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  if (!userId || userRole !== "professor") {
    window.location.href = "../pages/login.html";
    return;
  }

  const container = document.getElementById("studentsContainer");

  fetch(`http://localhost:8000/api/getProfessorStudents.php?professorId=${userId}`)
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No students found for your subjects.</p>";
        return;
      }

      data.forEach(student => {
        const card = document.createElement("div");
        card.className = "student-card";
        card.innerHTML = `
          <h3>${student.fullName}</h3>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Course:</strong> ${student.courseName}</p>
          <p><strong>Year:</strong> ${student.year} | Semester: ${student.semester}</p>
        `;
        container.appendChild(card);
      });
    });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });
});
