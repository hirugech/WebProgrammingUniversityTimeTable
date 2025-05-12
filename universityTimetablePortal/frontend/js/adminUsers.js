const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const addUserForm = document.getElementById("addUserForm");
  const userList = document.getElementById("userList");

  function createUserGroupCard(role, users) {
    const wrapper = document.createElement("div");
    wrapper.className = "user-role-group";

    const heading = document.createElement("h3");
    heading.textContent = role.charAt(0).toUpperCase() + role.slice(1) + "s";
    wrapper.appendChild(heading);

    const ul = document.createElement("ul");
    users.forEach(user => {
      const li = document.createElement("li");
      li.innerHTML = `
      <div class="user-item">
        <span><strong>${user.fullName}</strong> (${user.userRole}) - ${user.email}</span>
        <button class="delete-user red-btn" data-id="${user.userId}" data-name="${user.fullName}">Delete</button>
      </div>
    `;
    
      ul.appendChild(li);
    });

    wrapper.appendChild(ul);
    return wrapper;
  }

  function fetchUsers() {
    fetch("http://localhost:8000/api/getUsers.php")
      .then(res => res.json())
      .then(data => {
        userList.innerHTML = "";

        if (!data || data.length === 0) {
          userList.innerHTML = "<p>No users found.</p>";
          return;
        }

        const grouped = {
          student: [],
          professor: []
        };

        data.forEach(user => {
          if (grouped[user.userRole]) {
            grouped[user.userRole].push(user);
          }
        });

        for (const role in grouped) {
          if (grouped[role].length > 0) {
            const card = createUserGroupCard(role, grouped[role]);
            userList.appendChild(card);
          }
        }
      });
  }

  addUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addUserForm);

    fetch("http://localhost:8000/api/addUser.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          addUserForm.reset();
          fetchUsers();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(error => {
        console.error("Add user error:", error);
        alert("Something went wrong.");
      });
  });

  userList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-user")) {
      const id = e.target.dataset.id;
      const name = e.target.dataset.name;
      if (confirm(`Are you sure you want to delete ${name}?`)) {
        fetch("http://localhost:8000/api/deleteUser.php", {
          method: "POST",
          body: new URLSearchParams({ userId: id })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              fetchUsers();
            } else {
              alert("Error deleting user: " + data.message);
            }
          });
      }
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

  fetchUsers();
});
