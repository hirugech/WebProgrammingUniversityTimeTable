document.addEventListener("DOMContentLoaded", () => {
  const professorTimetable = document.getElementById("professorTimetable");
  const filterDay = document.getElementById("filterDay");

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  if (!userId || userRole !== "professor") {
    window.location.href = "../pages/login.html";
    return;
  }

  const fetchProfessorTimetable = () => {
    fetch(`http://localhost:8000/api/getProfessorTimetable.php?professorId=${userId}`)
      .then(res => res.json())
      .then(data => {
        const selectedDay = filterDay.value;
        const filtered = selectedDay
          ? data.filter(entry => entry.dayOfWeek === selectedDay)
          : data;

        professorTimetable.innerHTML = "";

        if (filtered.length === 0) {
          professorTimetable.innerHTML = "<li>No classes found.</li>";
          return;
        }

        filtered.forEach(entry => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${entry.subjectName}</strong> in Room ${entry.roomName}<br>
            ${entry.dayOfWeek} ${entry.startTime} - ${entry.endTime}
          `;
          professorTimetable.appendChild(li);
        });
      });
  };

  filterDay.addEventListener("change", fetchProfessorTimetable);
  fetchProfessorTimetable();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });
});
