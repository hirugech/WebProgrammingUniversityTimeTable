const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const addTimetableForm = document.getElementById("addTimetableForm");
  const subjectSelect = document.getElementById("subjectSelect");
  const professorSelect = document.getElementById("professorSelect");
  const roomSelect = document.getElementById("roomSelect");
  const timetableList = document.getElementById("timetableList");
  const filterDay = document.getElementById("filterDay");

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
          roomSelect.innerHTML += `<option value="${room.roomId}">${room.roomName} (Cap: ${room.capacity})</option>`;
        });
      });
  }

  function fetchTimetable() {
    const selectedDay = filterDay.value;

    fetch("http://localhost:8000/api/getTimetable.php")
      .then(res => res.json())
      .then(data => {
        const filtered = selectedDay
          ? data.filter(entry => entry.dayOfWeek === selectedDay)
          : data;

        const grouped = {};

        filtered.forEach(entry => {
          if (!grouped[entry.courseName]) {
            grouped[entry.courseName] = [];
          }
          grouped[entry.courseName].push(entry);
        });

        timetableList.innerHTML = "";

        if (Object.keys(grouped).length === 0) {
          timetableList.innerHTML = "<p>No timetable entries found.</p>";
          return;
        }

        for (const course in grouped) {
          const section = document.createElement("div");
          section.classList.add("timetable-course-section");

          const title = document.createElement("h3");
          title.textContent = course;
          section.appendChild(title);

          grouped[course].forEach(entry => {
            const li = document.createElement("li");
            li.innerHTML = `
              <strong>${entry.subjectName}</strong> |
              ${entry.professorName} |
              ${entry.roomName}<br>
              ${entry.dayOfWeek} ${entry.startTime} - ${entry.endTime}
              <button class="delete-timetable red-btn" data-id="${entry.timetableId}">Delete</button>
            `;
            section.appendChild(li);
          });

          timetableList.appendChild(section);
        }
      });
  }

  addTimetableForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addTimetableForm);

    fetch("http://localhost:8000/api/addTimetable.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          addTimetableForm.reset();
          fetchTimetable(); 
        } else {
          alert(" " + data.message); 
        }
      })
      .catch(err => {
        console.error("Submit error:", err);
        alert("Something went wrong.");
      });
  });

  timetableList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-timetable")) {
      const id = e.target.dataset.id;
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
