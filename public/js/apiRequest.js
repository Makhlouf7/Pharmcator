import axios from "axios";
import { showAlert, toggleLoader } from "./alerts";
const serverUrl = "http://127.0.0.1:8000";

export const apiRequest = async function (method, url, data = null) {
  try {
    const res = await axios({
      method,
      url: `${serverUrl}/${url}`,
      data,
    });
    return res;
  } catch (err) {
    // Go here if server responded out of 2xx
    const errorMessage =
      err.response?.data?.message || "Oops something went wrong";
    toggleLoader("hide");
    await showAlert(errorMessage, "error", 4000);
    return "Error";
  }
};
