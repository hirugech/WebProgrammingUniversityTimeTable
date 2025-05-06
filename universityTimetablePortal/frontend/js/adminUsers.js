
const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const addUserForm = document.getElementById("addUserForm");
  const userList = document.getElementById("userList");


  function fetchUsers() {
    fetch("http://localhost:8000/api/getUsers.php")
      .then(res => res.json())
      .then(data => {
        userList.innerHTML = "";

        if (!data || data.length === 0) {
          userList.innerHTML = "<li>No users found.</li>";
          return;
        }

        data.forEach(user => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${user.fullName}</strong> (${user.userRole}) - ${user.email}
          `;
          userList.appendChild(li);
        });
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
        alert("Something went wrong. Check console.");
      });
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

  fetchUsers(); 
});
