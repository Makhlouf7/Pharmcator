import { apiRequest } from "./apiRequest";
import { getFormData } from "./formUtils";
import { showAlert, toggleLoader } from "./alerts";
const formEl = document.querySelector("form");

formEl.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log(formEl.dataset.method);
  let formData = new FormData(formEl);
  console.log(...formData);
  if (formEl.enctype != "multipart/form-data") {
    formData = getFormData(formEl);
    console.log(formData);
  }
  toggleLoader("show");
  const res = await apiRequest(
    formEl.dataset.method,
    formEl.dataset.endpoint,
    formData
  );
  console.log(res.data);
  res.data.status == "success"
    ? await showAlert(res.data.message || "Success", "success")
    : await showAlert("Oops something wrong happen!", "error");
  await new Promise((resolve) => setTimeout(resolve, 0));
  toggleLoader("hide");
  const params = new URLSearchParams(window.location.search);
  window.location = params.get("redirect") || location.pathname;
  // location.reload();
});
