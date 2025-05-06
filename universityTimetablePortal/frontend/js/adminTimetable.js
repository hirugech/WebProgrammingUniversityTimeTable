const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("adminTimetable.js loaded");

  const addTimetableForm = document.getElementById("addTimetableForm");
  const subjectSelect = document.getElementById("subjectSelect");
  const professorSelect = document.getElementById("professorSelect");
  const roomSelect = document.getElementById("roomSelect");
  const timetableList = document.getElementById("timetableList");
  const filterDay = document.getElementById("filterDay");

  if (!addTimetableForm || !subjectSelect || !professorSelect || !roomSelect || !timetableList || !filterDay) {
    console.error("One or more required elements are missing in the HTML");
    return;
  }

  
  function fetchDropdowns() {
    fetch("http://localhost:8000/api/getSubjects.php")
      .then(res => res.json())
      .then(data => {
        subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
        data.forEach(subject => {
          subjectSelect.innerHTML += `<option value="${subject.subjectId}">${subject.subjectName} (${subject.courseName})</option>`;
        });
      });

    fetch("http://localhost:8000/api/getProfessors.php")
      .then(res => res.json())
      .then(data => {
        professorSelect.innerHTML = '<option value="">-- Select Professor --</option>';
        data.forEach(prof => {
          professorSelect.innerHTML += `<option value="${prof.userId}">${prof.fullName}</option>`;
        });
      });

    fetch("http://localhost:8000/api/getRooms.php")
      .then(res => res.json())
      .then(data => {
        roomSelect.innerHTML = '<option value="">-- Select Room --</option>';
        data.forEach(room => {
          roomSelect.innerHTML += `<option value="${room.roomId}">${room.roomName}</option>`;
        });
      });
  }


  addTimetableForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(" Submitting timetable form");

    const formData = new FormData(addTimetableForm);
    fetch("http://localhost:8000/api/addTimetable.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(" Response:", data);
        if (data.success) {
          addTimetableForm.reset();
          fetchTimetable();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(err => console.error("Submit error:", err));
  });


  function fetchTimetable() {
    const selectedDay = filterDay.value;
    fetch("http://localhost:8000/api/getTimetable.php")
      .then(res => res.json())
      .then(data => {
        const filtered = selectedDay
          ? data.filter(entry => entry.dayOfWeek === selectedDay)
          : data;

        timetableList.innerHTML = filtered.length
          ? filtered.map(entry => `
            <li>
              <strong>${entry.subjectName}</strong> | ${entry.professorName} | ${entry.roomName}<br>
              ${entry.dayOfWeek} ${entry.startTime} - ${entry.endTime}
              <button class="delete-timetable red-btn" data-id="${entry.timetableId}">Delete</button>
            </li>`).join("")
          : "<li>No timetable entries found.</li>";
      });
  }


  timetableList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-timetable")) {
      const id = e.target.dataset.id;
      console.log(" Deleting timetable ID:", id);
      fetch("http://localhost:8000/api/deleteTimetable.php", {
        method: "POST",
        body: new URLSearchParams({ timetableId: id })
      })
        .then(res => res.json())
        .then(() => fetchTimetable());
    }
  });

  filterDay.addEventListener("change", fetchTimetable);

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

  fetchDropdowns();
  fetchTimetable();
});
