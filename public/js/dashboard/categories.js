import { showConfirmDialog, toggleLoader, showAlert } from "../alerts";
import { apiRequest } from "../apiRequest";
const allDeleteBtns = document.querySelectorAll(".delete-doc");

allDeleteBtns.forEach((btn) =>
  btn.addEventListener("click", async function () {
    const endpoint = this.dataset.endpoint;
    if (await showConfirmDialog("You are about to delete this category")) {
      toggleLoader("show");
      await apiRequest("DELETE", endpoint);
      showAlert("Deleted successfully", "success");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      location.reload();
    } else {
      return;
    }
  })
);
