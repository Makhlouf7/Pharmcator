import { apiRequest } from "./apiRequest";
import { getFormData } from "./formUtils";

const formEl = document.querySelector("form");

const register = async function (data) {
  try {
    const res = await apiRequest("POST", "api/v1/users/signUp", data);
    console.log(res);
    if (res.data.status == "success") {
      console.log("Your account created successfully");
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
  register(formObj);
});
