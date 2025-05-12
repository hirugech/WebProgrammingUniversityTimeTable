const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const addSubjectForm = document.getElementById("addSubjectForm");
  const courseSelect = document.getElementById("courseSelect");
  const professorSelect = document.getElementById("professorSelect");
  const groupedSubjects = document.getElementById("groupedSubjects");

  if (!addSubjectForm || !courseSelect || !professorSelect || !groupedSubjects) {
    console.error("Missing required DOM elements.");
    return;
  }

  const fetchCourses = () => {
    fetch("http://localhost:8000/api/getCourses.php")
      .then(res => res.json())
      .then(data => {
        courseSelect.innerHTML = '<option value="">-- Select Course --</option>';
        data.forEach(course => {
          const option = document.createElement("option");
          option.value = course.courseId;
          option.textContent = `${course.courseName} (Semester ${course.semester})`;
          courseSelect.appendChild(option);
        });
      });
  };

  const fetchProfessors = () => {
    fetch("http://localhost:8000/api/getProfessors.php")
      .then(res => res.json())
      .then(data => {
        professorSelect.innerHTML = '<option value="">-- Select Professor --</option>';
        data.forEach(prof => {
          const option = document.createElement("option");
          option.value = prof.userId;
          option.textContent = prof.fullName;
          professorSelect.appendChild(option);
        });
      });
  };

  const fetchSubjects = () => {
    fetch("http://localhost:8000/api/getSubjects.php")
      .then(res => res.json())
      .then(data => {
        const grouped = {};

        data.forEach(subject => {
          if (!grouped[subject.courseName]) {
            grouped[subject.courseName] = [];
          }
          grouped[subject.courseName].push(subject);
        });

        groupedSubjects.innerHTML = "";

        for (const courseName in grouped) {
          const card = document.createElement("div");
          card.className = "card";

          const header = document.createElement("div");
          header.className = "card-header";
          header.textContent = courseName;

          const body = document.createElement("div");
          body.className = "card-body show";

          const list = document.createElement("ul");

          grouped[courseName].forEach(subject => {
            const li = document.createElement("li");
            const prof = subject.professorName
              ? `<em>${subject.professorName}</em>`
              : `<span class="unassigned">Unassigned</span>`;
            li.innerHTML = `
              <span class="subject-name">${subject.subjectName}</span> ${prof}
              <button class="delete-subject red-btn" data-id="${subject.subjectId}">Delete</button>
            `;
            list.appendChild(li);
          });

          body.appendChild(list);
          card.appendChild(header);
          card.appendChild(body);
          groupedSubjects.appendChild(card);
        }
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
      .then(data => {
        if (data.success) {
          addSubjectForm.reset();
          fetchSubjects(); 
        } else {
          alert(data.message || "Subject add failed.");
        }
        
      })
      .catch(error => {
        console.error("Request failed:", error);
      });
  });

  groupedSubjects.addEventListener("click", (e) => {
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

 
  fetchCourses();
  fetchProfessors();
  fetchSubjects();
});
