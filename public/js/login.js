import { apiRequest } from "./apiRequest";
import { getFormData } from "./formUtils";

const formEl = document.querySelector("form");

const login = async function (data) {
  await apiRequest("POST", "api/v1/users/login", data);
  const params = new URLSearchParams(window.location.search);
  window.location = params.get("redirect") || "/";
};

// Event Handlers
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const formObj = getFormData(formEl);
  login(formObj);
});
