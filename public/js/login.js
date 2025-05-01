import { apiRequest } from "./apiRequest";
import { getFormData } from "./formUtils";

const formEl = document.querySelector("form");

const login = async function (data) {
  try {
    const res = await apiRequest("POST", "api/v1/users/login", data);
    if (res.data.status == "success") {
      console.log("You have logged in successfully");
      window.location = "/";
    }
  } catch (err) {
    console.log(err);
  }
};

// Event Handlers
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const formObj = getFormData(formEl);
  login(formObj);
});
