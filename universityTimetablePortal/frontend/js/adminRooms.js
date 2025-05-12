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
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched rooms:", data); 
        roomList.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
          roomList.innerHTML = "<li>No rooms found.</li>";
          return;
        }

        data.forEach(room => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${room.roomName}</strong> Capacity: ${room.capacity}
            <button class="delete-room red-btn" data-id="${room.roomId}">Delete</button>
          `;
          roomList.appendChild(li);
        });
      })
      .catch(err => {
        console.error("Room fetch error:", err);
        alert("Could not load room list. See console for details.");
      });
  };

  addRoomForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch("http://localhost:8000/api/addRoom.php", {
      method: "POST",
      body: new FormData(addRoomForm)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Add Room Response:", data); 
        if (data.success) {
          addRoomForm.reset();
          fetchRooms();
        } else {
          alert(data.message || "An error occurred");
        }
      })
      .catch(err => {
        console.error("Add room error:", err);
        alert("Something went wrong while adding the room.");
      });
  });

  roomList.addEventListener("click", e => {
    if (e.target.classList.contains("delete-room")) {
      const id = e.target.dataset.id;
      fetch("http://localhost:8000/api/deleteRoom.php", {
        method: "POST",
        body: new URLSearchParams({ roomId: id })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(() => fetchRooms())
        .catch(err => {
          console.error("Delete error:", err);
          alert("Failed to delete room.");
        });
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../pages/login.html";
  });

  fetchRooms(); 
});
