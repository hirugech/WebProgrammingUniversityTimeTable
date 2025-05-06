document.addEventListener("DOMContentLoaded", () => {
  const timetableBody = document.querySelector("#studentTimetable tbody");
  const filterDay = document.getElementById("filterDay");
  const courseId = localStorage.getItem("courseId");
  const userRole = localStorage.getItem("userRole");

  if (!courseId || userRole !== "student") {
    window.location.href = "../pages/login.html";
    return;
  }

  const fetchStudentTimetable = () => {
    fetch(`http://localhost:8000/api/getStudentTimetable.php?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => {
        const selectedDay = filterDay.value;
        const filtered = selectedDay
          ? data.filter(entry => entry.dayOfWeek === selectedDay)
          : data;

        timetableBody.innerHTML = "";

        if (filtered.length === 0) {
          timetableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No classes found.</td></tr>`;
          return;
        }

        filtered.forEach(entry => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${entry.subjectName}</td>
            <td>${entry.professorName}</td>
            <td>${entry.roomName}</td>
            <td>${entry.dayOfWeek}</td>
            <td>${entry.startTime} - ${entry.endTime}</td>
          `;
          timetableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Failed to fetch timetable:", error);
      });
  };

  filterDay.addEventListener("change", fetchStudentTimetable);
  fetchStudentTimetable();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

  document.getElementById("exportTimetableBtn").addEventListener("click", () => {
    const controls = document.querySelector(".controls");
    const exportBtnContainer = document.querySelector(".export-btn-container");


    controls.style.display = "none";
    exportBtnContainer.style.display = "none";

    const table = document.querySelector(".table-container");

    html2canvas(table).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("student-timetable.pdf");

     
      controls.style.display = "block";
      exportBtnContainer.style.display = "block";
    });
  });
});
