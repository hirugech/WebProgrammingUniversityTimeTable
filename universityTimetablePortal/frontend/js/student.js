document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const logoutBtn = document.getElementById("logoutBtn");
  const timetableBody = document.querySelector("#studentTimetable tbody");
  const courseInfo = document.getElementById("courseInfo");
  const filterDay = document.getElementById("filterDay");
  const exportBtn = document.getElementById("exportTimetableBtn");

  if (!userId || userRole !== "student") {
    window.location.href = "../pages/login.html";
    return;
  }

  function fetchStudentTimetable() {
    fetch(`http://localhost:8000/api/getStudentTimetable.php?studentId=${userId}`)
      .then(res => res.json())
      .then(data => {
       
        if (data.length > 0) {
          courseInfo.textContent = `${data[0].courseName} | Year ${data[0].year}, Semester ${data[0].semester}`;
        }
//filter
        const selectedDay = filterDay.value;
        const filtered = selectedDay
          ? data.filter(entry => entry.dayOfWeek === selectedDay)
          : data;

        timetableBody.innerHTML = "";

        if (filtered.length === 0) {
          timetableBody.innerHTML = "<tr><td colspan='5'>No classes found.</td></tr>";
          return;
        }

        filtered.forEach(entry => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${entry.subjectName}</td>
            <td>${entry.professorName}</td>
            <td>${entry.roomName}</td>
            <td>${entry.dayOfWeek}</td>
            <td>${entry.startTime} - ${entry.endTime}</td>
          `;
          timetableBody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Error loading timetable:", err);
        timetableBody.innerHTML = "<tr><td colspan='5'>Failed to load timetable.</td></tr>";
      });
  }

  filterDay.addEventListener("change", fetchStudentTimetable);

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../pages/login.html";
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      html2canvas(document.querySelector(".student-container")).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("student_timetable.pdf");
      });
    });
  }

  fetchStudentTimetable();
});
