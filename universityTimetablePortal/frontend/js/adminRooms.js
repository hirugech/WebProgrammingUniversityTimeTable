const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");
if (!userId || userRole !== "admin") {
  window.location.href = "../pages/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const addRoomForm = document.getElementById("addRoomForm");
  const roomList = document.getElementById("roomList");

  const fetchRooms = () => {
    fetch("http://localhost:8000/api/getRooms.php")
      .then(res => res.json())
      .then(data => {
        roomList.innerHTML = "";
        if (data.length === 0) {
          roomList.innerHTML = "<li>No rooms found.</li>";
          return;
        }
        data.forEach(room => {
          roomList.innerHTML += `
            <li>${room.roomName}
              <button class="delete-room red-btn" data-id="${room.roomId}">Delete</button>
            </li>`;
        });
      });
  };

  addRoomForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch("http://localhost:8000/api/addRoom.php", {
      method: "POST",
      body: new FormData(addRoomForm)
    })
      .then(res => res.json())
      .then(() => {
        addRoomForm.reset();
        fetchRooms();
      });
  });

  roomList.addEventListener("click", e => {
    if (e.target.classList.contains("delete-room")) {
      const id = e.target.dataset.id;
      fetch("http://localhost:8000/api/deleteRoom.php", {
        method: "POST",
        body: new URLSearchParams({ roomId: id })
      })
        .then(res => res.json())
        .then(() => fetchRooms());
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

  fetchRooms();
});
