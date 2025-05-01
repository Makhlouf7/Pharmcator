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
    formData = getFormData(formData);
  }
  toggleLoader("show");
  const res = await apiRequest(
    formEl.dataset.method,
    formEl.dataset.endpoint,
    formData
  );
  console.log(res.data);
  res.data.status == "success"
    ? showAlert("Saved successfully", "success")
    : showAlert("Oops something wrong happen!", "error");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  location.reload();
});
