document.addEventListener("DOMContentLoaded", () => {
  console.log("professor.js loaded");

  const professorName = document.getElementById("professorName");
  const professorEmail = document.getElementById("professorEmail");
  const timetableBody = document.getElementById("professorTimetable");
  const filterDay = document.getElementById("filterDay");
  const logoutBtn = document.getElementById("logoutBtn");

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const fullName = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");

  if (!userId || userRole !== "professor") {
    window.location.href = "../pages/login.html";
    return;
  }

  professorName.textContent = fullName || "Professor";
  professorEmail.textContent = email || "-";

  function loadTimetable() {
    fetch(`http://localhost:8000/api/getProfessorTimetable.php?professorId=${userId}`)
      .then(res => res.json())
      .then(data => {
        const selectedDay = filterDay.value;
        const filtered = selectedDay
          ? data.filter(entry => entry.dayOfWeek === selectedDay)
          : data;

        timetableBody.innerHTML = "";

        if (filtered.length === 0) {
          timetableBody.innerHTML = `<tr><td colspan="5">No classes scheduled.</td></tr>`;
          return;
        }

        filtered.forEach(entry => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${entry.subjectName}</td>
            <td>${entry.roomName}</td>
            <td>${entry.dayOfWeek}</td>
            <td>${entry.startTime}</td>
            <td>${entry.endTime}</td>
          `;
          timetableBody.appendChild(tr);
        });
      });
  }

  filterDay.addEventListener("change", loadTimetable);
  loadTimetable();

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../pages/login.html";
    });
  }
});
