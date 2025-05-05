import { apiRequest } from "./apiRequest";
// Defining Elements =====
const logoutBtn = document.getElementById("logout");

// Event Handlers =====
if (logoutBtn)
  logoutBtn.addEventListener("click", async function () {
    try {
      const res = await apiRequest("POST", "api/v1/users/logout");
      if (res.data.status == "success") {
        console.log("Logged out successfully");
        location.reload();
      }
    } catch (err) {
      console.log("Error from logout");
    }
  });
